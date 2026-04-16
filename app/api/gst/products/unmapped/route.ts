import { NextRequest, NextResponse } from "next/server";
import { listUnmappedProducts } from "../../../../../services/gst/product-tax-map";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const result = await listUnmappedProducts({
    search: url.searchParams.get("search") || undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, data: result.data ?? [] });
}
