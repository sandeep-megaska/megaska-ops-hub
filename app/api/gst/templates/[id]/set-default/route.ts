import { NextRequest, NextResponse } from "next/server";
import { setDefaultTemplate } from "../../../../../../services/gst/template";

export const runtime = "nodejs";

export async function POST(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const result = await setDefaultTemplate(id);

  if (!result.ok || !result.data) {
    const status = result.error === "Template not found" ? 404 : 400;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  return NextResponse.json({ ok: true, updated: result.data.updated }, { status: 200 });
}
