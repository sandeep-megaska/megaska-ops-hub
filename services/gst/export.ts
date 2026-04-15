import { writeGstAuditLog } from "./audit";
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

function exportTypeFilter(exportType: GstExportRequest["exportType"]): string[] {
  return exportType === "notes_register" ? ["CREDIT_NOTE", "DEBIT_NOTE"] : ["TAX_INVOICE"];
}

function toAmount(value: unknown): string {
  return String(value ?? "0");
}

function formatDate(value: Date): string {
  return value.toISOString().slice(0, 10);
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
      cessAmount: toAmount(doc.cessAmount || 0),
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

export async function prepareGstExport(request: GstExportRequest): Promise<GstServiceResult<GstExportBatchResult>> {
  try {
    const types = exportTypeFilter(request.exportType);
    const documents = await gstDb.gstDocument.findMany({
      where: {
        gstSettingsId: request.gstSettingsId,
        documentType: { in: types },
        documentDate: { gte: request.periodStart, lte: request.periodEnd },
      },
      orderBy: [{ documentDate: "asc" }, { documentNumber: "asc" }],
      include: { lines: { orderBy: { lineNumber: "asc" } } },
    });

    const rows = buildStableRows(request.exportType, documents);

    const created = await gstDb.$transaction(async (tx) => {
      const exportBatch = await tx.gstExport.create({
        data: {
          gstSettingsId: request.gstSettingsId,
          exportType: request.exportType,
          periodStart: request.periodStart,
          periodEnd: request.periodEnd,
          status: "GENERATED",
          filters: request.filters || {},
          generatedByType: "SYSTEM",
          generatedAt: new Date(),
        },
      });

      if (rows.length > 0) {
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
      }

      return exportBatch;
    });

    await writeGstAuditLog(
      {
        action: "GST_EXPORT_GENERATED",
        gstSettingsId: request.gstSettingsId,
        gstExportId: created.id,
        nextState: {
          exportType: request.exportType,
          periodStart: request.periodStart,
          periodEnd: request.periodEnd,
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
    return { ok: false, error: "Failed to prepare GST export batch" };
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
