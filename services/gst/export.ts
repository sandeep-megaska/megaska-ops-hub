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
  if (exportType === "notes_register") {
    return ["CREDIT_NOTE", "DEBIT_NOTE"];
  }

  return ["TAX_INVOICE"];
}

function toAmount(value: unknown): string {
  return String(value ?? "0");
}

function formatDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function buildInvoiceRegisterRow(doc: GstExportRowInput) {
  return {
    registerType: "invoice_register",
    gstDocumentId: doc.id,
    documentType: doc.documentType,
    documentNumber: doc.documentNumber,
    documentDate: formatDate(doc.documentDate),
    status: doc.status,
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
  };
}

function buildNotesRegisterRow(doc: GstExportRowInput) {
  return {
    registerType: "notes_register",
    gstDocumentId: doc.id,
    noteType: doc.documentType,
    documentNumber: doc.documentNumber,
    documentDate: formatDate(doc.documentDate),
    status: doc.status,
    originalDocumentId: doc.originalDocumentId,
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
  };
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

function buildStableRows(
  exportType: GstExportRequest["exportType"],
  documents: GstExportRowInput[],
): Array<Record<string, unknown>> {
  const builder = exportType === "notes_register" ? buildNotesRegisterRow : buildInvoiceRegisterRow;

  return documents.map((doc) => builder(doc)).sort((a, b) => {
    const ad = String(a.documentDate || "");
    const bd = String(b.documentDate || "");
    if (ad !== bd) {
      return ad.localeCompare(bd);
    }

    return String(a.documentNumber || "").localeCompare(String(b.documentNumber || ""));
  });
}

function getHeaders(exportType: GstExportRequest["exportType"]): string[] {
  if (exportType === "notes_register") {
    return [
      "registerType",
      "gstDocumentId",
      "noteType",
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

  return [
    "registerType",
    "gstDocumentId",
    "documentType",
    "documentNumber",
    "documentDate",
    "status",
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

export async function prepareGstExport(
  request: GstExportRequest,
): Promise<GstServiceResult<GstExportBatchResult>> {
  try {
    const types = exportTypeFilter(request.exportType);
    const documents = await gstDb.gstDocument.findMany({
      where: {
        gstSettingsId: request.gstSettingsId,
        documentType: { in: types },
        documentDate: {
          gte: request.periodStart,
          lte: request.periodEnd,
        },
      },
      orderBy: [{ documentDate: "asc" }, { documentNumber: "asc" }],
      include: {
        lines: { orderBy: { lineNumber: "asc" } },
      },
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
            documentType: String(row.documentType || row.noteType || ""),
            documentNumber: String(row.documentNumber),
            documentDate: new Date(String(row.documentDate)),
            status: "READY",
            payload: row,
          })),
        });
      }

      return exportBatch;
    });

    console.info("[GST EXPORT] Generated GST export batch", {
      gstExportId: created.id,
      exportType: created.exportType,
      periodStart: request.periodStart.toISOString(),
      periodEnd: request.periodEnd.toISOString(),
      itemCount: rows.length,
    });

    return {
      ok: true,
      data: {
        exportId: created.id,
        exportType: request.exportType,
        status: created.status,
        itemCount: rows.length,
        payload: {
          headers: getHeaders(request.exportType),
          rows,
        },
      },
    };
  } catch (error) {
    console.error("[GST EXPORT] prepareGstExport failed", {
      error: error instanceof Error ? error.message : String(error),
    });

    return { ok: false, error: "Failed to prepare GST export batch" };
  }
}
