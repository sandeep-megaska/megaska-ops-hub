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

    const rows = documents.map((doc) => ({
      gstDocumentId: doc.id,
      documentType: doc.documentType,
      documentNumber: doc.documentNumber,
      documentDate: doc.documentDate,
      status: doc.status,
      taxableAmount: String(doc.taxableAmount),
      cgstAmount: String(doc.cgstAmount),
      sgstAmount: String(doc.sgstAmount),
      igstAmount: String(doc.igstAmount),
      totalAmount: String(doc.totalAmount),
      lineCount: Array.isArray(doc.lines) ? doc.lines.length : 0,
    }));

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
            documentType: row.documentType,
            documentNumber: String(row.documentNumber),
            documentDate: row.documentDate as Date,
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
          headers: [
            "documentType",
            "documentNumber",
            "documentDate",
            "status",
            "taxableAmount",
            "cgstAmount",
            "sgstAmount",
            "igstAmount",
            "totalAmount",
            "lineCount",
          ],
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
