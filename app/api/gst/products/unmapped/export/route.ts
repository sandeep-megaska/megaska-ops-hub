import { NextResponse } from "next/server";
import { exportUnmappedSkusCsv } from "../../../../../../services/gst/product-tax-bulk";

export const runtime = "nodejs";

export async function GET() {
  const result = await exportUnmappedSkusCsv();
  if (!result.ok || !result.data) {
    return NextResponse.json({ ok: false, data: null, error: result.error || "Failed to export unmapped SKUs" }, { status: 400 });
  }

  return new NextResponse(result.data, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="gst-unmapped-skus-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
