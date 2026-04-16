import type { GstServiceResult } from "./types";

export interface GstHsnCodeRecord {
  id: string;
  hsnCode: string;
  description: string;
  isService: boolean;
  isActive: boolean;
  effectiveFrom: Date | null;
  effectiveTo: Date | null;
  metadata: Record<string, unknown> | null;
}

export interface GstTaxSlabRecord {
  id: string;
  slabCode: string;
  taxRate: number;
  cessRate: number;
  isActive: boolean;
  effectiveFrom: Date | null;
  effectiveTo: Date | null;
}

export interface UpsertHsnCodeInput {
  id?: string;
  hsnCode: string;
  description: string;
  isService?: boolean;
  isActive?: boolean;
  effectiveFrom?: Date | string | null;
  effectiveTo?: Date | string | null;
  metadata?: Record<string, unknown> | null;
}

export interface UpsertTaxSlabInput {
  id?: string;
  slabCode: string;
  taxRate: number;
  cessRate?: number;
  isActive?: boolean;
  effectiveFrom?: Date | string | null;
  effectiveTo?: Date | string | null;
}

export interface AssignSlabToHsnInput {
  hsnId: string;
  slabId: string;
  effectiveFrom?: Date | string | null;
  effectiveTo?: Date | string | null;
  priority?: number;
}

export async function listHsnCodes(): Promise<GstServiceResult<GstHsnCodeRecord[]>> {
  return { ok: true, data: [] };
}

export async function upsertHsnCode(input: UpsertHsnCodeInput): Promise<GstServiceResult<GstHsnCodeRecord>> {
  return { ok: false, error: `Not implemented: upsertHsnCode (${input.hsnCode})` };
}

export async function listTaxSlabs(): Promise<GstServiceResult<GstTaxSlabRecord[]>> {
  return { ok: true, data: [] };
}

export async function upsertTaxSlab(input: UpsertTaxSlabInput): Promise<GstServiceResult<GstTaxSlabRecord>> {
  return { ok: false, error: `Not implemented: upsertTaxSlab (${input.slabCode})` };
}

export async function assignSlabToHsn(input: AssignSlabToHsnInput): Promise<GstServiceResult<{ id: string }>> {
  return { ok: false, error: `Not implemented: assignSlabToHsn (${input.hsnId})` };
}

export async function resolveApplicableSlab(hsnCode: string, asOfDate?: Date): Promise<GstServiceResult<GstTaxSlabRecord | null>> {
  return { ok: true, data: null };
}
