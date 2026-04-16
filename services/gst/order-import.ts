import type { GstServiceResult } from "./types";

export interface GstOrderImportRangeInput {
  from: Date;
  to: Date;
}

export interface GstImportedOrdersFilters {
  importStatus?: "IMPORTED" | "INVOICE_READY" | "INVOICED" | "NOTE_ISSUED" | "FAILED";
  eligibilityStatus?: "ELIGIBLE" | "NOT_ELIGIBLE" | "REVIEW_REQUIRED";
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface GstOrderImportMarkDocumentInput {
  gstOrderImportId: string;
  gstDocumentId: string;
}

export async function importOrderByShopifyId(orderId: string): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { orderId, placeholder: true } };
}

export async function syncOrderRange(input: GstOrderImportRangeInput): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { ...input, placeholder: true } };
}

export async function listImportedOrders(filters: GstImportedOrdersFilters): Promise<GstServiceResult<Array<Record<string, unknown>>>> {
  return { ok: true, data: [{ filters, placeholder: true }] };
}

export async function getImportedOrderDetail(id: string): Promise<GstServiceResult<Record<string, unknown> | null>> {
  return { ok: true, data: { id, placeholder: true } };
}

export async function markOrderInvoiced(input: GstOrderImportMarkDocumentInput): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { ...input, placeholder: true } };
}

export async function markOrderNoteIssued(input: GstOrderImportMarkDocumentInput): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { ...input, placeholder: true } };
}
