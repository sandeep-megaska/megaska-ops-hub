import { writeGstAuditLog } from "./audit";
import { GST_DOCUMENT_TYPES } from "./constants";
import { gstDb } from "./db";
import type { GstExportRequest, GstServiceResult } from "./types";

export interface GstExportBatchResult {
  exportId: string;
  exportType: GstExportRequest["exportType"];
  status: string;
  itemCount: number;
  payload: {
    headers: string[];
    rows: Array<Record<string, unknown>>;
  };
}

const ELIGIBLE_EXPORT_STATUSES = ["ISSUED"] as const;

type GstExportErrorCode =
  | "INVALID_PERIOD"
  | "NO_DOCUMENTS_IN_PERIOD"
  | "UNSUPPORTED_DOCUMENT_STATES"
  | "EXPORT_BATCH_ALREADY_EXISTS"
  | "EXPORT_BATCH_PERSISTENCE_FAILED"
  | "EXPORT_BATCH_PREPARATION_FAILED";

function fail(
  errorCode: GstExportErrorCode,
  error: string,
  errorDetails?: Record<string, unknown>,
): GstServiceResult<GstExportBatchResult> {
  return { ok: false, errorCode, error, errorDetails };
}

function exportTypeFilter(exportType: GstExportRequest["exportType"]): string[] {
  return exportType === "notes_register" ? [GST_DOCUMENT_TYPES[1], GST_DOCUMENT_TYPES[2]] : [GST_DOCUMENT_TYPES[0]];
}

function toAmount(value: unknown): string {
  if (typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }
  if (typeof value === "string") {
    return value;
  }
  if (value && typeof value === "object" && "toString" in value && typeof value.toString === "function") {
    return value.toString();
  }
  return "0";
}

function formatDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function normalizePeriod(periodStart: Date, periodEnd: Date): { start: Date; end: Date } | null {
  if (!(periodStart instanceof Date) || Number.isNaN(periodStart.getTime())) {
    return null;
  }
  if (!(periodEnd instanceof Date) || Number.isNaN(periodEnd.getTime())) {
    return null;
  }

  const start = new Date(periodStart);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(periodEnd);
  end.setUTCHours(23, 59, 59, 999);

  if (start.getTime() > end.getTime()) {
    return null;
  }

  return { start, end };
}

type GstExportRowInput = {
  id: string;
  documentType: string;
  documentNumber: string;
  documentDate: Date;
  status: string;
  supplyType?: string | null;
  placeOfSupplyStateCode?: string | null;
  isInterstate?: boolean | null;
  originalDocumentId?: string | null;
  taxableAmount: unknown;
  cgstAmount: unknown;
  sgstAmount: unknown;
  igstAmount: unknown;
  cessAmount?: unknown;
  totalAmount: unknown;
  lines?: unknown[];
};

function buildStableRows(exportType: GstExportRequest["exportType"], documents: GstExportRowInput[]): Array<Record<string, unknown>> {
  return documents
    .map((doc) => ({
      registerType: exportType,
      gstDocumentId: doc.id,
      documentType: doc.documentType,
      noteType: doc.documentType,
      documentNumber: doc.documentNumber,
      documentDate: formatDate(doc.documentDate),
      status: doc.status,
      originalDocumentId: doc.originalDocumentId || null,
      supplyType: doc.supplyType || "",
      placeOfSupplyStateCode: doc.placeOfSupplyStateCode || "",
      isInterstate: Boolean(doc.isInterstate),
      taxableAmount: toAmount(doc.taxableAmount),
      cgstAmount: toAmount(doc.cgstAmount),
      sgstAmount: toAmount(doc.sgstAmount),
      igstAmount: toAmount(doc.igstAmount),
      cessAmount: toAmount(doc.cessAmount),
      totalAmount: toAmount(doc.totalAmount),
      lineCount: Array.isArray(doc.lines) ? doc.lines.length : 0,
    }))
    .sort((a, b) => `${a.documentDate}`.localeCompare(`${b.documentDate}`) || `${a.documentNumber}`.localeCompare(`${b.documentNumber}`));
}

function getHeaders(): string[] {
  return [
    "registerType",
    "gstDocumentId",
    "documentType",
    "documentNumber",
    "documentDate",
    "status",
    "originalDocumentId",
    "supplyType",
    "placeOfSupplyStateCode",
    "isInterstate",
    "taxableAmount",
    "cgstAmount",
    "sgstAmount",
    "igstAmount",
    "cessAmount",
    "totalAmount",
    "lineCount",
  ];
}

function mapPersistenceError(error: unknown): GstServiceResult<GstExportBatchResult> {
  const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";

  if (code === "P2002") {
    return fail("EXPORT_BATCH_ALREADY_EXISTS", "GST export batch already exists for the selected period and export type");
  }

  return fail("EXPORT_BATCH_PERSISTENCE_FAILED", "Failed to persist GST export batch", {
    cause: error instanceof Error ? error.message : String(error),
  });
}

export async function prepareGstExport(request: GstExportRequest): Promise<GstServiceResult<GstExportBatchResult>> {
  try {
    const period = normalizePeriod(request.periodStart, request.periodEnd);
    if (!period) {
      return fail("INVALID_PERIOD", "Invalid GST export period. Ensure periodStart and periodEnd are valid dates and periodStart <= periodEnd");
    }

    const types = exportTypeFilter(request.exportType);
    const documents = await gstDb.gstDocument.findMany({
      where: {
        gstSettingsId: request.gstSettingsId,
        documentType: { in: types },
        documentDate: { gte: period.start, lte: period.end },
      },
      orderBy: [{ documentDate: "asc" }, { documentNumber: "asc" }],
      include: { lines: { orderBy: { lineNumber: "asc" } } },
    });

    if (documents.length === 0) {
      return fail("NO_DOCUMENTS_IN_PERIOD", "No GST documents found in the selected period for this export type", {
        exportType: request.exportType,
        periodStart: period.start.toISOString(),
        periodEnd: period.end.toISOString(),
      });
    }

    const eligibleDocuments = documents.filter((doc) => ELIGIBLE_EXPORT_STATUSES.includes(doc.status as (typeof ELIGIBLE_EXPORT_STATUSES)[number]));

    if (eligibleDocuments.length === 0) {
      const statuses = [...new Set(documents.map((doc) => doc.status))].sort();
      return fail("UNSUPPORTED_DOCUMENT_STATES", "GST documents were found, but none are in an export-eligible state", {
        eligibleStatuses: [...ELIGIBLE_EXPORT_STATUSES],
        foundStatuses: statuses,
      });
    }

    const rows = buildStableRows(request.exportType, eligibleDocuments);

    let created: { id: string; status: string };
    try {
      created = await gstDb.$transaction(async (tx) => {
        const exportBatch = await tx.gstExport.create({
          data: {
            gstSettingsId: request.gstSettingsId,
            exportType: request.exportType,
            periodStart: period.start,
            periodEnd: period.end,
            status: "GENERATED",
            filters: request.filters || {},
            generatedByType: "SYSTEM",
            generatedAt: new Date(),
          },
        });

        await tx.gstExportItem.createMany({
          data: rows.map((row, index) => ({
            gstExportId: exportBatch.id,
            gstDocumentId: String(row.gstDocumentId),
            rowNumber: index + 1,
            documentType: String(row.documentType || ""),
            documentNumber: String(row.documentNumber),
            documentDate: new Date(String(row.documentDate)),
            status: "READY",
            payload: row,
          })),
        });

        return exportBatch;
      });
    } catch (error) {
      return mapPersistenceError(error);
    }

    await writeGstAuditLog(
      {
        action: "GST_EXPORT_GENERATED",
        gstSettingsId: request.gstSettingsId,
        gstExportId: created.id,
        nextState: {
          exportType: request.exportType,
          periodStart: period.start,
          periodEnd: period.end,
          itemCount: rows.length,
        },
      },
      { actorType: "SYSTEM" },
    );

    return {
      ok: true,
      data: {
        exportId: created.id,
        exportType: request.exportType,
        status: created.status,
        itemCount: rows.length,
        payload: { headers: getHeaders(), rows },
      },
    };
  } catch (error) {
    console.error("[GST EXPORT] prepareGstExport failed", { error: error instanceof Error ? error.message : String(error) });
    return fail("EXPORT_BATCH_PREPARATION_FAILED", "Failed to prepare GST export batch", {
      cause: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function listGstExports(gstSettingsId: string): Promise<GstServiceResult<Array<Record<string, unknown>>>> {
  try {
    const rows = await gstDb.gstExport.findMany({
      where: { gstSettingsId: String(gstSettingsId).trim() },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return { ok: true, data: rows };
  } catch (error) {
    console.error("[GST EXPORT] listGstExports failed", { error: error instanceof Error ? error.message : String(error) });
    return { ok: false, error: "Failed to list GST exports" };
  }
}
