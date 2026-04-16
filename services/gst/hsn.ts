import type { GstServiceResult } from "./types";

export interface GstHsnCodeInput {
  hsnCode: string;
  description: string;
  isService?: boolean;
  isActive: boolean;
  effectiveFrom?: Date | null;
  effectiveTo?: Date | null;
  metadata?: Record<string, unknown> | null;
}

export interface GstTaxSlabInput {
  slabCode: string;
  taxRate: number;
  cessRate?: number;
  isActive: boolean;
  effectiveFrom?: Date | null;
  effectiveTo?: Date | null;
}

export interface GstHsnSlabAssignmentInput {
  hsnId: string;
  slabId: string;
  effectiveFrom?: Date | null;
  effectiveTo?: Date | null;
  priority?: number;
}

export async function listHsnCodes(): Promise<GstServiceResult<Array<Record<string, unknown>>>> {
  return { ok: true, data: [] };
}

export async function upsertHsnCode(input: GstHsnCodeInput): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { ...input, placeholder: true } };
}

export async function listTaxSlabs(): Promise<GstServiceResult<Array<Record<string, unknown>>>> {
  return { ok: true, data: [] };
}

export async function upsertTaxSlab(input: GstTaxSlabInput): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { ...input, placeholder: true } };
}

export async function assignSlabToHsn(input: GstHsnSlabAssignmentInput): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { ...input, placeholder: true } };
}

export async function resolveApplicableSlab(hsnCode: string, asOfDate: Date): Promise<GstServiceResult<Record<string, unknown> | null>> {
  return { ok: true, data: { hsnCode, asOfDate, placeholder: true } };
}
