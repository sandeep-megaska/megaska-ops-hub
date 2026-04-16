import { NextRequest, NextResponse } from "next/server";
import { generateInvoiceBatch } from "../../../../../../services/gst/dispatch-batch";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, data: null, error: "Invalid JSON payload" }, { status: 400 });
  }

  const result = await generateInvoiceBatch({
    orderImportIds: Array.isArray(body.orderImportIds) ? body.orderImportIds.map(String) : [],
    templateId: body.templateId ? String(body.templateId) : undefined,
    regenerate: Boolean(body.regenerate),
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, data: null, error: result.error || "Failed to generate invoice batch" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, data: result.data, error: null });
}
