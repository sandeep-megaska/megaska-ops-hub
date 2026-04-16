import type { GstServiceResult } from "./types";

export type GstOrderImportLifecycleStatus = "IMPORTED" | "INVOICE_READY" | "INVOICED" | "NOTE_ISSUED" | "FAILED";

const ALLOWED_STATUS_TRANSITIONS: Record<GstOrderImportLifecycleStatus, GstOrderImportLifecycleStatus[]> = {
  IMPORTED: ["INVOICE_READY", "FAILED"],
  INVOICE_READY: ["INVOICED", "FAILED"],
  INVOICED: ["NOTE_ISSUED", "FAILED"],
  NOTE_ISSUED: [],
  FAILED: ["IMPORTED"],
};

export function canTransitionOrderImportStatus(
  from: GstOrderImportLifecycleStatus,
  to: GstOrderImportLifecycleStatus,
): boolean {
  return ALLOWED_STATUS_TRANSITIONS[from].includes(to);
}

export async function assertOrderImportStatusTransition(
  from: GstOrderImportLifecycleStatus,
  to: GstOrderImportLifecycleStatus,
): Promise<GstServiceResult<{ allowed: boolean }>> {
  return { ok: true, data: { allowed: canTransitionOrderImportStatus(from, to) } };
}
