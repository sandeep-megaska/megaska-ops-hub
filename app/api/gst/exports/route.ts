import { NextRequest, NextResponse } from "next/server";
import { listGstExports, prepareGstExport } from "../../../../services/gst/export";
import { getActiveGstSettings } from "../../../../services/gst/settings";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const settings = await getActiveGstSettings();
  if (!settings.ok || !settings.data) {
    return NextResponse.json({ ok: false, error: settings.error || "Active GST settings not found" }, { status: 404 });
  }

  const result = await listGstExports(settings.data.id);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, exports: result.data || [] });
}

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

  const result = await prepareGstExport({
    gstSettingsId: settings.data.id,
    exportType: body.exportType === "notes_register" ? "notes_register" : "invoice_register",
    periodStart,
    periodEnd,
    filters: body.filters && typeof body.filters === "object" ? (body.filters as Record<string, unknown>) : {},
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, export: result.data }, { status: 201 });
}
