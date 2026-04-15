import { NextRequest, NextResponse } from "next/server";
import { createGstReconciliationRun } from "../../../../../services/gst/reconcile";
import { getActiveGstSettings } from "../../../../../services/gst/settings";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });
  }

  const settings = await getActiveGstSettings();
  if (!settings.ok || !settings.data) {
    return NextResponse.json({ ok: false, error: settings.error || "Active GST settings not found" }, { status: 404 });
  }

  const periodStart = new Date(String(body.periodStart || ""));
  const periodEnd = new Date(String(body.periodEnd || ""));
  if (Number.isNaN(periodStart.getTime()) || Number.isNaN(periodEnd.getTime())) {
    return NextResponse.json({ ok: false, error: "periodStart and periodEnd are required ISO dates" }, { status: 400 });
  }

  const sourceDocuments = Array.isArray(body.sourceDocuments)
    ? body.sourceDocuments.map((doc) => {
        const safe = (doc || {}) as Record<string, unknown>;
        return {
          documentNumber: String(safe.documentNumber || ""),
          documentType: safe.documentType ? String(safe.documentType) : undefined,
          documentDate: safe.documentDate ? String(safe.documentDate) : undefined,
          totalAmount: safe.totalAmount ? Number(safe.totalAmount) : undefined,
          status: safe.status ? String(safe.status) : undefined,
        };
      })
    : [];

  const result = await createGstReconciliationRun({
    gstSettingsId: settings.data.id,
    periodStart,
    periodEnd,
    sourceSystem: String(body.sourceSystem || "MANUAL"),
    sourceDocuments,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, reconciliation: result.data }, { status: 201 });
}
