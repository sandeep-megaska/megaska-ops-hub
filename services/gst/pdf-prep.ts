import type { GstServiceResult } from "./types";

export async function prepareInvoicePdfPayload(input: { gstDocumentId: string }): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { ...input, placeholder: true } };
}

export async function prepareNotePdfPayload(input: { gstDocumentId: string }): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { ...input, placeholder: true } };
}

export async function prepareTemplatePreviewPdf(input: { templateId: string; orderImportId?: string | null }): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { ...input, placeholder: true } };
}
