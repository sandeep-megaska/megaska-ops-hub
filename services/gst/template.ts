import type { GstServiceResult } from "./types";

export interface GstInvoiceTemplateRecord {
  id: string;
  gstSettingsId: string;
  templateName: string;
  isActive: boolean;
  isDefault: boolean;
  version: number;
  headerText: string | null;
  footerText: string | null;
  declarationText: string | null;
  notesText: string | null;
  logoFileUrl: string | null;
  themeConfig: Record<string, unknown> | null;
}

export interface CreateTemplateInput {
  gstSettingsId: string;
  templateName: string;
  isDefault?: boolean;
  headerText?: string | null;
  footerText?: string | null;
  declarationText?: string | null;
  notesText?: string | null;
  logoFileUrl?: string | null;
  themeConfig?: Record<string, unknown> | null;
}

export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {
  isActive?: boolean;
}

export interface ResolveTemplateForOrderInput {
  gstSettingsId: string;
  orderImportId?: string;
}

export interface BuildTemplatePreviewPayloadInput {
  templateId: string;
  orderImportId?: string;
  payloadOverrides?: Record<string, unknown>;
}

export async function createTemplate(input: CreateTemplateInput): Promise<GstServiceResult<GstInvoiceTemplateRecord>> {
  return { ok: false, error: `Not implemented: createTemplate (${input.templateName})` };
}

export async function updateTemplate(id: string, patch: UpdateTemplateInput): Promise<GstServiceResult<GstInvoiceTemplateRecord>> {
  return { ok: false, error: `Not implemented: updateTemplate (${id})` };
}

export async function listTemplates(gstSettingsId: string): Promise<GstServiceResult<GstInvoiceTemplateRecord[]>> {
  return { ok: true, data: [] };
}

export async function setDefaultTemplate(id: string): Promise<GstServiceResult<{ updated: boolean }>> {
  return { ok: false, error: `Not implemented: setDefaultTemplate (${id})` };
}

export async function resolveTemplateForOrder(input: ResolveTemplateForOrderInput): Promise<GstServiceResult<GstInvoiceTemplateRecord | null>> {
  return { ok: true, data: null };
}

export async function buildTemplatePreviewPayload(input: BuildTemplatePreviewPayloadInput): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { templateId: input.templateId, preview: true } };
}
