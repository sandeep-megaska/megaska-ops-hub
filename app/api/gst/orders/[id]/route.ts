import { NextRequest, NextResponse } from "next/server";
import { getImportedOrderDetail } from "../../../../../services/gst/order-import";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const result = await getImportedOrderDetail(params.id);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  if (!result.data) {
    return NextResponse.json({ ok: false, error: "Imported order not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: result.data });
}
