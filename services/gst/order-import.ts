import type { GstServiceResult } from "./types";

export interface GstOrderImportRecord {
  id: string;
  gstSettingsId: string;
  shopifyOrderId: string;
  shopifyOrderName: string;
  importStatus: string;
  eligibilityStatus: string;
  orderCreatedAt: Date;
  lastSyncedAt: Date | null;
}

export interface GstOrderImportFilters {
  gstSettingsId?: string;
  importStatus?: string;
  eligibilityStatus?: string;
  from?: Date | string;
  to?: Date | string;
}

export interface SyncOrderRangeInput {
  from: Date | string;
  to: Date | string;
  gstSettingsId?: string;
}

export interface MarkOrderDocumentInput {
  gstOrderImportId: string;
  gstDocumentId: string;
}

export async function importOrderByShopifyId(orderId: string): Promise<GstServiceResult<GstOrderImportRecord>> {
  return { ok: false, error: `Not implemented: importOrderByShopifyId (${orderId})` };
}

export async function syncOrderRange(input: SyncOrderRangeInput): Promise<GstServiceResult<{ queued: boolean }>> {
  return { ok: true, data: { queued: false } };
}

export async function listImportedOrders(filters: GstOrderImportFilters): Promise<GstServiceResult<GstOrderImportRecord[]>> {
  return { ok: true, data: [] };
}

export async function getImportedOrderDetail(id: string): Promise<GstServiceResult<Record<string, unknown> | null>> {
  return { ok: true, data: null };
}

export async function markOrderInvoiced(input: MarkOrderDocumentInput): Promise<GstServiceResult<{ updated: boolean }>> {
  return { ok: false, error: `Not implemented: markOrderInvoiced (${input.gstOrderImportId})` };
}

export async function markOrderNoteIssued(input: MarkOrderDocumentInput): Promise<GstServiceResult<{ updated: boolean }>> {
  return { ok: false, error: `Not implemented: markOrderNoteIssued (${input.gstOrderImportId})` };
}
