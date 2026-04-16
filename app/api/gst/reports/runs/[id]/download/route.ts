import { NextRequest, NextResponse } from "next/server";
import { downloadReportFile } from "../../../../../../../services/gst/report-export";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const result = await downloadReportFile(id);

  if (!result.ok || !result.data) {
    return NextResponse.json({ ok: false, error: result.error || "Failed to load report file" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, ...result.data });
}
