import { gstDb } from "./db";
import type { GstServiceResult } from "./types";

export interface GstProductTaxMapRecord {
  id: string;
  shopifyProductId: string;
  shopifyVariantId: string | null;
  hsnId: string;
  slabId: string;
  source: string;
  status: string;
  effectiveFrom: Date | null;
  effectiveTo: Date | null;
  lastValidatedAt: Date | null;
  metadata: Record<string, unknown> | null;
}

export interface ProductTaxMappingFilters {
  status?: string;
  shopifyProductId?: string;
  shopifyVariantId?: string;
  search?: string;
}

export interface UpsertProductTaxMappingInput {
  id?: string;
  shopifyProductId: string;
  shopifyVariantId?: string | null;
  hsnId: string;
  slabId: string;
  source: string;
  status: string;
  effectiveFrom?: Date | string | null;
  effectiveTo?: Date | string | null;
  metadata?: Record<string, unknown> | null;
}

export interface ResolveLineTaxMappingInput {
  shopifyProductId: string;
  shopifyVariantId?: string | null;
}

type ProductTaxDbClient = {
  gstProductTaxMap: {
    findMany: (args: unknown) => Promise<Array<Record<string, unknown>>>;
    update: (args: unknown) => Promise<Record<string, unknown>>;
    upsert: (args: unknown) => Promise<Record<string, unknown>>;
    findFirst: (args: unknown) => Promise<Record<string, unknown> | null>;
  };
  gstOrderImportLine: {
    findMany: (args: unknown) => Promise<Array<Record<string, unknown>>>;
  };
};

const productTaxDb = gstDb as unknown as ProductTaxDbClient;

function toDate(value?: Date | string | null): Date | null {
  if (!value) {
    return null;
  }

  const parsed = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toRecord(row: {
  id: string;
  shopifyProductId: string;
  shopifyVariantId: string | null;
  hsnId: string;
  slabId: string;
  source: string;
  status: string;
  effectiveFrom: Date | null;
  effectiveTo: Date | null;
  lastValidatedAt: Date | null;
  metadata: unknown;
}): GstProductTaxMapRecord {
  const metadata = row.metadata && typeof row.metadata === "object" ? (row.metadata as Record<string, unknown>) : null;

  return {
    id: row.id,
    shopifyProductId: row.shopifyProductId,
    shopifyVariantId: row.shopifyVariantId,
    hsnId: row.hsnId,
    slabId: row.slabId,
    source: row.source,
    status: row.status,
    effectiveFrom: row.effectiveFrom,
    effectiveTo: row.effectiveTo,
    lastValidatedAt: row.lastValidatedAt,
    metadata,
  };
}

function isActiveStatus(status: string): boolean {
  const normalized = status.trim().toUpperCase();
  return normalized === "ACTIVE" || normalized === "APPROVED";
}

function buildWhere(filters: ProductTaxMappingFilters): Record<string, unknown> {
  const where: Record<string, unknown> = {};

  if (filters.status) {
    where.status = String(filters.status);
  }

  if (filters.shopifyProductId) {
    where.shopifyProductId = String(filters.shopifyProductId);
  }

  if (filters.shopifyVariantId) {
    where.shopifyVariantId = String(filters.shopifyVariantId);
  }

  if (filters.search) {
    const search = String(filters.search).trim();
    if (search) {
      where.OR = [
        { shopifyProductId: { contains: search, mode: "insensitive" } },
        { shopifyVariantId: { contains: search, mode: "insensitive" } },
        { source: { contains: search, mode: "insensitive" } },
      ];
    }
  }

  return where;
}

export async function listProductTaxMappings(filters: ProductTaxMappingFilters): Promise<GstServiceResult<GstProductTaxMapRecord[]>> {
  try {
    const rows = await productTaxDb.gstProductTaxMap.findMany({
      where: buildWhere(filters),
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    });

    return { ok: true, data: rows.map((row) => toRecord(row as never)) };
  } catch (error) {
    console.error("[GST PRODUCT TAX MAP] listProductTaxMappings failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return { ok: false, error: "Failed to list product tax mappings" };
  }
}

export async function upsertProductTaxMapping(input: UpsertProductTaxMappingInput): Promise<GstServiceResult<GstProductTaxMapRecord>> {
  const shopifyProductId = String(input.shopifyProductId || "").trim();
  const shopifyVariantId = input.shopifyVariantId ? String(input.shopifyVariantId).trim() : null;
  const hsnId = String(input.hsnId || "").trim();
  const slabId = String(input.slabId || "").trim();

  if (!shopifyProductId || !hsnId || !slabId) {
    return { ok: false, error: "shopifyProductId, hsnId and slabId are required" };
  }

  try {
    const effectiveFrom = toDate(input.effectiveFrom);
    const effectiveTo = toDate(input.effectiveTo);

    const payload = {
      shopifyProductId,
      shopifyVariantId,
      hsnId,
      slabId,
      source: String(input.source || "manual"),
      status: String(input.status || "ACTIVE").toUpperCase(),
      effectiveFrom,
      effectiveTo,
      metadata: input.metadata ?? null,
      lastValidatedAt: new Date(),
    };

    const row = input.id
      ? await productTaxDb.gstProductTaxMap.update({ where: { id: String(input.id) }, data: payload })
      : await productTaxDb.gstProductTaxMap.upsert({
          where: {
            shopifyProductId_shopifyVariantId: {
              shopifyProductId,
              shopifyVariantId,
            },
          },
          create: payload,
          update: payload,
        });

    return { ok: true, data: toRecord(row as never) };
  } catch (error) {
    console.error("[GST PRODUCT TAX MAP] upsertProductTaxMapping failed", {
      error: error instanceof Error ? error.message : String(error),
      shopifyProductId,
      shopifyVariantId,
    });
    return { ok: false, error: "Failed to upsert product tax mapping" };
  }
}

export async function bulkUpsertProductTaxMappings(rows: UpsertProductTaxMappingInput[]): Promise<GstServiceResult<{ processed: number }>> {
  try {
    let processed = 0;

    for (const row of rows) {
      const result = await upsertProductTaxMapping(row);
      if (!result.ok) {
        return { ok: false, error: result.error || `Failed after ${processed} rows` };
      }
      processed += 1;
    }

    return { ok: true, data: { processed } };
  } catch (error) {
    console.error("[GST PRODUCT TAX MAP] bulkUpsertProductTaxMappings failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return { ok: false, error: "Failed to bulk upsert product tax mappings" };
  }
}

export async function listUnmappedProducts(filters: ProductTaxMappingFilters): Promise<GstServiceResult<Array<Record<string, unknown>>>> {
  try {
    const search = String(filters.search || "").trim().toLowerCase();
    const lines = (await productTaxDb.gstOrderImportLine.findMany({
      where: { shopifyProductId: { not: null } },
      select: {
        shopifyProductId: true,
        shopifyVariantId: true,
        title: true,
        sku: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 1000,
    })) as Array<Record<string, unknown>>;

    const seen = new Set<string>();
    const unmapped: Array<Record<string, unknown>> = [];

    for (const line of lines) {
      const productId = String(line.shopifyProductId || "").trim();
      if (!productId) {
        continue;
      }
      const variantId = line.shopifyVariantId ? String(line.shopifyVariantId) : null;
      const key = `${productId}:${variantId || "_product"}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);

      const resolved = await resolveLineTaxMapping({ shopifyProductId: productId, shopifyVariantId: variantId });
      if (!resolved.ok) {
        return { ok: false, error: resolved.error || "Failed to resolve tax mapping" };
      }

      if (resolved.data) {
        continue;
      }

      const searchable = `${productId} ${variantId || ""} ${line.title || ""} ${line.sku || ""}`.toLowerCase();
      if (search && !searchable.includes(search)) {
        continue;
      }

      unmapped.push({
        shopifyProductId: productId,
        shopifyVariantId: variantId,
        title: line.title ?? null,
        sku: line.sku ?? null,
      });
    }

    return { ok: true, data: unmapped };
  } catch (error) {
    console.error("[GST PRODUCT TAX MAP] listUnmappedProducts failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return { ok: false, error: "Failed to list unmapped products" };
  }
}

export async function resolveLineTaxMapping(input: ResolveLineTaxMappingInput): Promise<GstServiceResult<GstProductTaxMapRecord | null>> {
  const shopifyProductId = String(input.shopifyProductId || "").trim();
  const shopifyVariantId = input.shopifyVariantId ? String(input.shopifyVariantId).trim() : null;
  if (!shopifyProductId) {
    return { ok: false, error: "shopifyProductId is required" };
  }

  const now = new Date();
  const activeWindowFilter = {
    OR: [{ effectiveFrom: null }, { effectiveFrom: { lte: now } }],
    AND: [{ OR: [{ effectiveTo: null }, { effectiveTo: { gte: now } }] }],
  };

  try {
    if (shopifyVariantId) {
      const variantMapping = await productTaxDb.gstProductTaxMap.findFirst({
        where: {
          shopifyProductId,
          shopifyVariantId,
          ...activeWindowFilter,
        },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      });

      if (variantMapping && isActiveStatus(String(variantMapping.status || ""))) {
        return { ok: true, data: toRecord(variantMapping as never) };
      }
    }

    const productMapping = await productTaxDb.gstProductTaxMap.findFirst({
      where: {
        shopifyProductId,
        shopifyVariantId: null,
        ...activeWindowFilter,
      },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    });

    if (productMapping && isActiveStatus(String(productMapping.status || ""))) {
      return { ok: true, data: toRecord(productMapping as never) };
    }

    return { ok: true, data: null };
  } catch (error) {
    console.error("[GST PRODUCT TAX MAP] resolveLineTaxMapping failed", {
      error: error instanceof Error ? error.message : String(error),
      shopifyProductId,
      shopifyVariantId,
    });
    return { ok: false, error: "Failed to resolve line tax mapping" };
  }
}
