import { NextRequest, NextResponse } from "next/server";
import { renderGstPdf } from "../../../../../../services/gst/pdf";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const result = await renderGstPdf(id);
  if (!result.ok || !result.data) {
    return NextResponse.json({ ok: false, error: result.error || "Unable to render PDF payload" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, pdf: result.data });
}
