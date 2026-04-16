import { NextRequest, NextResponse } from "next/server";
import { listDispatchReadyOrders } from "../../../../../../services/gst/dispatch-batch";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams;
  const result = await listDispatchReadyOrders({
    from: query.get("from") || undefined,
    to: query.get("to") || undefined,
    invoiceStatus: query.get("invoiceStatus") || undefined,
    readiness: query.get("readiness") || undefined,
    syncRunId: query.get("syncRunId") || undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, data: null, error: result.error || "Failed to load dispatch-ready orders" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, data: result.data || [], error: null });
}
