import { NextRequest, NextResponse } from "next/server";
import { listTaxSlabs, upsertTaxSlab } from "../../../../services/gst/hsn";

export const runtime = "nodejs";

export async function GET() {
  const result = await listTaxSlabs();
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, data: result.data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });
  }

  const result = await upsertTaxSlab({
    id: body.id ? String(body.id) : undefined,
    slabCode: String(body.slabCode || ""),
    taxRate: Number(body.taxRate),
    cessRate: body.cessRate !== undefined ? Number(body.cessRate) : 0,
    isActive: body.isActive === false ? false : true,
    effectiveFrom: body.effectiveFrom ? String(body.effectiveFrom) : null,
    effectiveTo: body.effectiveTo ? String(body.effectiveTo) : null,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, data: result.data }, { status: 201 });
}
