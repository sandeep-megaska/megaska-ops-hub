import { NextRequest, NextResponse } from "next/server";
import { getGstDocumentById } from "../../../../../services/gst/documents";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const result = await getGstDocumentById(params.id);

  if (!result.ok || !result.data) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 404 });
  }

  return NextResponse.json({ ok: true, document: result.data });
}
