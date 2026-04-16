import { NextRequest, NextResponse } from "next/server";
import { listImportedOrders } from "../../../../services/gst/order-import";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const result = await listImportedOrders({
    gstSettingsId: url.searchParams.get("gstSettingsId") || undefined,
    importStatus: url.searchParams.get("importStatus") || undefined,
    eligibilityStatus: url.searchParams.get("eligibilityStatus") || undefined,
    from: url.searchParams.get("from") || undefined,
    to: url.searchParams.get("to") || undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, data: result.data ?? [] });
}
