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

export async function listProductTaxMappings(filters: ProductTaxMappingFilters): Promise<GstServiceResult<GstProductTaxMapRecord[]>> {
  return { ok: true, data: [] };
}

export async function upsertProductTaxMapping(input: UpsertProductTaxMappingInput): Promise<GstServiceResult<GstProductTaxMapRecord>> {
  return { ok: false, error: `Not implemented: upsertProductTaxMapping (${input.shopifyProductId})` };
}

export async function bulkUpsertProductTaxMappings(rows: UpsertProductTaxMappingInput[]): Promise<GstServiceResult<{ processed: number }>> {
  return { ok: true, data: { processed: rows.length } };
}

export async function listUnmappedProducts(filters: ProductTaxMappingFilters): Promise<GstServiceResult<Array<Record<string, unknown>>>> {
  return { ok: true, data: [] };
}

export async function resolveLineTaxMapping(input: ResolveLineTaxMappingInput): Promise<GstServiceResult<GstProductTaxMapRecord | null>> {
  return { ok: true, data: null };
}
