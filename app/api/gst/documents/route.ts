import { NextRequest, NextResponse } from "next/server";
import { listGstDocuments } from "../../../../services/gst/documents";
import { getActiveGstSettings } from "../../../../services/gst/settings";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const settings = await getActiveGstSettings();
  if (!settings.ok || !settings.data) {
    return NextResponse.json({ ok: false, error: settings.error || "Active GST settings not found" }, { status: 404 });
  }

  const url = req.nextUrl;
  const result = await listGstDocuments({
    gstSettingsId: settings.data.id,
    documentType: (url.searchParams.get("documentType") || undefined) as
      | "TAX_INVOICE"
      | "CREDIT_NOTE"
      | "DEBIT_NOTE"
      | undefined,
    status: url.searchParams.get("status") || undefined,
    search: url.searchParams.get("search") || undefined,
    limit: url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : undefined,
  });

  if (!result.ok || !result.data) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, documents: result.data });
}
