import { NextRequest, NextResponse } from "next/server";
import { buildTemplatePreviewPayload } from "../../../../../../services/gst/template";

export const runtime = "nodejs";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const { id } = await context.params;

  const result = await buildTemplatePreviewPayload({
    templateId: id,
    orderImportId: body.orderImportId ? String(body.orderImportId) : undefined,
    payloadOverrides:
      body.payloadOverrides && typeof body.payloadOverrides === "object" && !Array.isArray(body.payloadOverrides)
        ? (body.payloadOverrides as Record<string, unknown>)
        : undefined,
  });

  if (!result.ok || !result.data) {
    const status = result.error === "Template not found" || result.error === "Order import not found" ? 404 : 400;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  return NextResponse.json({ ok: true, preview: result.data }, { status: 200 });
}
