import type { GstServiceResult } from "./types";

export interface GstSettingsSnapshot {
  id?: string;
  gstin?: string;
  stateCode?: string;
  invoicePrefix?: string;
  creditNotePrefix?: string;
  debitNotePrefix?: string;
}

export async function getActiveGstSettings(): Promise<GstServiceResult<GstSettingsSnapshot>> {
  return { ok: true, data: {} };
}
