import type { GstServiceResult } from "./types";

export interface GstTemplateInput {
  gstSettingsId: string;
  templateName: string;
  isActive: boolean;
  isDefault: boolean;
  headerText?: string | null;
  footerText?: string | null;
  declarationText?: string | null;
  notesText?: string | null;
  logoFileUrl?: string | null;
  themeConfig?: Record<string, unknown> | null;
}

export interface GstTemplatePreviewInput {
  templateId: string;
  orderImportId?: string;
}

export async function createTemplate(input: GstTemplateInput): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { ...input, placeholder: true } };
}

export async function updateTemplate(id: string, patch: Partial<GstTemplateInput>): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { id, patch, placeholder: true } };
}

export async function listTemplates(gstSettingsId: string): Promise<GstServiceResult<Array<Record<string, unknown>>>> {
  return { ok: true, data: [{ gstSettingsId, placeholder: true }] };
}

export async function setDefaultTemplate(id: string): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { id, placeholder: true } };
}

export async function resolveTemplateForOrder(input: { gstSettingsId: string; orderImportId: string }): Promise<GstServiceResult<Record<string, unknown> | null>> {
  return { ok: true, data: { ...input, placeholder: true } };
}

export async function buildTemplatePreviewPayload(input: GstTemplatePreviewInput): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { ...input, placeholder: true } };
}
