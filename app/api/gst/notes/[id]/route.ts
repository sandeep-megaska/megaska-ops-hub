import { NextRequest, NextResponse } from "next/server";
import { getGstNoteById } from "../../../../../services/gst/notes";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const result = await getGstNoteById(params.id);

  if (!result.ok || !result.data) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 404 });
  }

  const note = result.data;
  return NextResponse.json({ ok: true, note });
}
