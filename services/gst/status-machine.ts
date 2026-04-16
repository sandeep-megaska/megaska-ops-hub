import type { GstServiceResult } from "./types";

export type GstOrderImportStatus = "IMPORTED" | "INVOICE_READY" | "INVOICED" | "NOTE_ISSUED" | "FAILED";

export interface GstStatusTransitionInput {
  from: GstOrderImportStatus;
  to: GstOrderImportStatus;
}

export function canTransitionOrderImportStatus(input: GstStatusTransitionInput): GstServiceResult<{ allowed: boolean }> {
  return { ok: true, data: { allowed: false } };
}

export function assertOrderImportStatusTransition(input: GstStatusTransitionInput): GstServiceResult<true> {
  return { ok: false, error: `Not implemented: transition ${input.from} -> ${input.to}` };
}
