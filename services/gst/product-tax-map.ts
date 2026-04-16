import type { GstServiceResult } from "./types";

export interface GstProductTaxMapFilters {
  status?: "MAPPED" | "UNMAPPED" | "REVIEW_REQUIRED";
  productId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface GstProductTaxMapInput {
  shopifyProductId: string;
  shopifyVariantId?: string | null;
  hsnId: string;
  slabId: string;
  source: "MANUAL" | "CSV_IMPORT" | "AUTO_INHERIT";
  status: "MAPPED" | "UNMAPPED" | "REVIEW_REQUIRED";
  effectiveFrom?: Date | null;
  effectiveTo?: Date | null;
  metadata?: Record<string, unknown> | null;
}

export interface GstProductTaxMapResolveInput {
  shopifyProductId: string;
  shopifyVariantId?: string | null;
}

export async function listProductTaxMappings(filters: GstProductTaxMapFilters): Promise<GstServiceResult<Array<Record<string, unknown>>>> {
  return { ok: true, data: [{ filters, placeholder: true }] };
}

export async function upsertProductTaxMapping(input: GstProductTaxMapInput): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { ...input, placeholder: true } };
}

export async function bulkUpsertProductTaxMappings(rows: GstProductTaxMapInput[]): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { processed: rows.length, placeholder: true } };
}

export async function listUnmappedProducts(filters: GstProductTaxMapFilters): Promise<GstServiceResult<Array<Record<string, unknown>>>> {
  return { ok: true, data: [{ filters, placeholder: true }] };
}

export async function resolveLineTaxMapping(input: GstProductTaxMapResolveInput): Promise<GstServiceResult<Record<string, unknown> | null>> {
  return { ok: true, data: { ...input, placeholder: true } };
}
