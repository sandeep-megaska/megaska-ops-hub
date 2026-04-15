import { NextRequest, NextResponse } from "next/server";
import { getGstInvoiceById } from "../../../../../services/gst/invoice";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const result = await getGstInvoiceById(params.id);

  if (!result.ok || !result.data) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 404 });
  }

  const invoice = result.data;
  return NextResponse.json({ ok: true, invoice });
}
