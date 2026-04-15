import { writeGstAuditLog } from "./audit";
import { reconcileGstDocuments } from "./compliance";
import { gstDb } from "./db";
import type { GstReconcileRunInput, GstServiceResult } from "./types";

export async function createGstReconciliationRun(input: GstReconcileRunInput): Promise<GstServiceResult<Record<string, unknown>>> {
  try {
    const books = await gstDb.gstDocument.findMany({
      where: {
        gstSettingsId: input.gstSettingsId,
        documentDate: { gte: input.periodStart, lte: input.periodEnd },
      },
      select: {
        documentNumber: true,
        documentType: true,
        documentDate: true,
        totalAmount: true,
        status: true,
      },
    });

    const comparison = reconcileGstDocuments(
      books.map((doc) => ({
        documentNumber: String(doc.documentNumber),
        documentType: String(doc.documentType),
        documentDate: new Date(String(doc.documentDate)).toISOString().slice(0, 10),
        totalAmount: Number(doc.totalAmount || 0),
        status: String(doc.status),
      })),
      input.sourceDocuments,
    );

    if (!comparison.ok || !comparison.data) {
      return { ok: false, error: comparison.error || "Reconciliation failed" };
    }

    const created = await gstDb.gstReconciliationRun.create({
      data: {
        gstSettingsId: input.gstSettingsId,
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
        sourceSystem: input.sourceSystem,
        status: comparison.data.mismatches.length > 0 ? "MISMATCH" : "MATCHED",
        matchedCount: comparison.data.summary.matchedCount,
        mismatchedCount: comparison.data.summary.mismatchedCount,
        missingInBooksCount: comparison.data.summary.missingInBooksCount,
        missingInPortalCount: comparison.data.summary.missingInSourceCount,
        summary: comparison.data,
        completedAt: new Date(),
      },
    });

    await writeGstAuditLog(
      {
        action: "GST_RECONCILIATION_RUN_CREATED",
        gstSettingsId: input.gstSettingsId,
        reconciliationRunId: String(created.id),
        nextState: comparison.data.summary,
      },
      { actorType: "SYSTEM" },
    );

    return { ok: true, data: { run: created, comparison: comparison.data } };
  } catch (error) {
    console.error("[GST RECO] createGstReconciliationRun failed", { error: error instanceof Error ? error.message : String(error) });
    return { ok: false, error: "Failed to create reconciliation run" };
  }
}
