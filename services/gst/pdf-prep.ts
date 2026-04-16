import type { GstServiceResult } from "./types";

export interface PreparePdfPayloadInput {
  gstDocumentId: string;
}

export interface PrepareTemplatePreviewPdfInput {
  templateId: string;
  orderImportId?: string;
}

export async function prepareInvoicePdfPayload(input: PreparePdfPayloadInput): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { gstDocumentId: input.gstDocumentId, documentType: "TAX_INVOICE" } };
}

export async function prepareNotePdfPayload(input: PreparePdfPayloadInput): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { gstDocumentId: input.gstDocumentId, documentType: "NOTE" } };
}

export async function prepareTemplatePreviewPdf(input: PrepareTemplatePreviewPdfInput): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { templateId: input.templateId, orderImportId: input.orderImportId || null } };
}
