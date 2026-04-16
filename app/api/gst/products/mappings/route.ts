import { NextRequest, NextResponse } from "next/server";
import {
  bulkUpsertProductTaxMappings,
  listProductTaxMappings,
  upsertProductTaxMapping,
} from "../../../../../services/gst/product-tax-map";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const result = await listProductTaxMappings({
    status: url.searchParams.get("status") || undefined,
    shopifyProductId: url.searchParams.get("shopifyProductId") || undefined,
    shopifyVariantId: url.searchParams.get("shopifyVariantId") || undefined,
    search: url.searchParams.get("search") || undefined,
  });

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

  if (Array.isArray(body.rows)) {
    const bulkResult = await bulkUpsertProductTaxMappings(
      body.rows.map((row) => {
        const value = row as Record<string, unknown>;
        return {
          id: value.id ? String(value.id) : undefined,
          shopifyProductId: String(value.shopifyProductId || ""),
          shopifyVariantId: value.shopifyVariantId ? String(value.shopifyVariantId) : null,
          hsnId: String(value.hsnId || ""),
          slabId: String(value.slabId || ""),
          source: String(value.source || "manual"),
          status: String(value.status || "ACTIVE"),
          effectiveFrom: value.effectiveFrom ? String(value.effectiveFrom) : null,
          effectiveTo: value.effectiveTo ? String(value.effectiveTo) : null,
          metadata: value.metadata && typeof value.metadata === "object" ? (value.metadata as Record<string, unknown>) : null,
        };
      }),
    );

    if (!bulkResult.ok) {
      return NextResponse.json({ ok: false, error: bulkResult.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, data: bulkResult.data }, { status: 201 });
  }

  const result = await upsertProductTaxMapping({
    id: body.id ? String(body.id) : undefined,
    shopifyProductId: String(body.shopifyProductId || ""),
    shopifyVariantId: body.shopifyVariantId ? String(body.shopifyVariantId) : null,
    hsnId: String(body.hsnId || ""),
    slabId: String(body.slabId || ""),
    source: String(body.source || "manual"),
    status: String(body.status || "ACTIVE"),
    effectiveFrom: body.effectiveFrom ? String(body.effectiveFrom) : null,
    effectiveTo: body.effectiveTo ? String(body.effectiveTo) : null,
    metadata: body.metadata && typeof body.metadata === "object" ? (body.metadata as Record<string, unknown>) : null,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, data: result.data }, { status: 201 });
}
