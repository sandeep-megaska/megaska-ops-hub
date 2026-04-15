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
    const comparisonData = comparison.data;

    const created = await gstDb.gstReconciliationRun.create({
      data: {
        gstSettingsId: input.gstSettingsId,
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
        sourceSystem: input.sourceSystem,
        status: comparisonData.mismatches.length > 0 ? "MISMATCH" : "MATCHED",
        matchedCount: comparisonData.summary.matchedCount,
        mismatchedCount: comparisonData.summary.mismatchedCount,
        missingInBooksCount: comparisonData.summary.missingInBooksCount,
        missingInPortalCount: comparisonData.summary.missingInSourceCount,
        summary: comparisonData,
        completedAt: new Date(),
      },
    });

    await writeGstAuditLog(
      {
        action: "GST_RECONCILIATION_RUN_CREATED",
        gstSettingsId: input.gstSettingsId,
        reconciliationRunId: String(created.id),
        nextState: comparisonData.summary,
      },
      { actorType: "SYSTEM" },
    );

    return { ok: true, data: { run: created, comparison: comparisonData } };
  } catch (error) {
    console.error("[GST RECO] createGstReconciliationRun failed", { error: error instanceof Error ? error.message : String(error) });
    return { ok: false, error: "Failed to create reconciliation run" };
  }
}
