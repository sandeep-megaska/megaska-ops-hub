import type { GstServiceResult } from "./types";
import { gstDb } from "./db";
import { getActiveGstSettings } from "./settings";

type TemplateDbClient = {
  gstSettings: {
    findUnique: (args: unknown) => Promise<{ id: string } | null>;
  };
  gstOrderImport: {
    findUnique: (args: unknown) => Promise<Record<string, unknown> | null>;
  };
  gstInvoiceTemplate: {
    create: (args: unknown) => Promise<Record<string, unknown>>;
    findUnique: (args: unknown) => Promise<Record<string, unknown> | null>;
    findFirst: (args: unknown) => Promise<Record<string, unknown> | null>;
    findMany: (args: unknown) => Promise<Array<Record<string, unknown>>>;
    update: (args: unknown) => Promise<Record<string, unknown>>;
    updateMany: (args: unknown) => Promise<{ count: number }>;
  };
  $transaction: <T>(fn: (tx: TemplateDbClient) => Promise<T>) => Promise<T>;
};

const templateDb = gstDb as unknown as TemplateDbClient;

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

function normalize(value: unknown): string {
  return String(value ?? "").trim();
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function toTemplateRecord(row: Record<string, unknown>): GstInvoiceTemplateRecord {
  return {
    id: String(row.id),
    gstSettingsId: String(row.gstSettingsId),
    templateName: String(row.templateName || ""),
    isActive: Boolean(row.isActive),
    isDefault: Boolean(row.isDefault),
    version: Number(row.version || 1),
    headerText: row.headerText ? String(row.headerText) : null,
    footerText: row.footerText ? String(row.footerText) : null,
    declarationText: row.declarationText ? String(row.declarationText) : null,
    notesText: row.notesText ? String(row.notesText) : null,
    logoFileUrl: row.logoFileUrl ? String(row.logoFileUrl) : null,
    themeConfig: asObject(row.themeConfig),
  };
}

function buildPreviewOrderPayload(orderImport: Record<string, unknown>): Record<string, unknown> {
  const snapshot = asObject(orderImport.snapshot) || {};
  return {
    id: String(orderImport.id),
    shopifyOrderId: String(orderImport.shopifyOrderId || ""),
    shopifyOrderName: String(orderImport.shopifyOrderName || ""),
    orderCurrency: String(orderImport.orderCurrency || "INR"),
    orderSubtotal: Number(orderImport.orderSubtotal || 0),
    orderTaxTotal: Number(orderImport.orderTaxTotal || 0),
    orderGrandTotal: Number(orderImport.orderGrandTotal || 0),
    shippingStateCode: orderImport.shippingStateCode ? String(orderImport.shippingStateCode) : null,
    billingStateCode: orderImport.billingStateCode ? String(orderImport.billingStateCode) : null,
    importStatus: String(orderImport.importStatus || ""),
    eligibilityStatus: String(orderImport.eligibilityStatus || ""),
    snapshot,
    lines: Array.isArray(orderImport.lines) ? orderImport.lines : [],
  };
}

export async function createTemplate(input: CreateTemplateInput): Promise<GstServiceResult<GstInvoiceTemplateRecord>> {
  const gstSettingsId = normalize(input.gstSettingsId);
  const templateName = normalize(input.templateName);
  if (!gstSettingsId) {
    return { ok: false, error: "gstSettingsId is required" };
  }
  if (!templateName) {
    return { ok: false, error: "templateName is required" };
  }

  try {
    const settings = await templateDb.gstSettings.findUnique({ where: { id: gstSettingsId }, select: { id: true } });
    if (!settings) {
      return { ok: false, error: "GST settings not found" };
    }

    const created = await templateDb.$transaction(async (tx) => {
      const existingDefault = await tx.gstInvoiceTemplate.findFirst({
        where: { gstSettingsId, isDefault: true },
        select: { id: true },
      });

      const shouldBeDefault = Boolean(input.isDefault) || !existingDefault;
      if (shouldBeDefault) {
        await tx.gstInvoiceTemplate.updateMany({
          where: { gstSettingsId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.gstInvoiceTemplate.create({
        data: {
          gstSettingsId,
          templateName,
          isActive: true,
          isDefault: shouldBeDefault,
          headerText: input.headerText ?? null,
          footerText: input.footerText ?? null,
          declarationText: input.declarationText ?? null,
          notesText: input.notesText ?? null,
          logoFileUrl: input.logoFileUrl ?? null,
          themeConfig: input.themeConfig ?? null,
          version: 1,
        },
      });
    });

    return { ok: true, data: toTemplateRecord(created) };
  } catch (error) {
    console.error("[GST TEMPLATE] createTemplate failed", { error: error instanceof Error ? error.message : String(error) });
    return { ok: false, error: "Failed to create template" };
  }
}

export async function updateTemplate(id: string, patch: UpdateTemplateInput): Promise<GstServiceResult<GstInvoiceTemplateRecord>> {
  const templateId = normalize(id);
  if (!templateId) {
    return { ok: false, error: "templateId is required" };
  }

  try {
    const updated = await templateDb.$transaction(async (tx) => {
      const existing = await tx.gstInvoiceTemplate.findUnique({ where: { id: templateId } });
      if (!existing) {
        return null;
      }

      const gstSettingsId = String(existing.gstSettingsId);
      if (patch.isDefault === true) {
        await tx.gstInvoiceTemplate.updateMany({
          where: { gstSettingsId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.gstInvoiceTemplate.update({
        where: { id: templateId },
        data: {
          templateName: patch.templateName !== undefined ? normalize(patch.templateName) : undefined,
          isActive: typeof patch.isActive === "boolean" ? patch.isActive : undefined,
          isDefault: patch.isDefault === true ? true : undefined,
          headerText: patch.headerText !== undefined ? patch.headerText : undefined,
          footerText: patch.footerText !== undefined ? patch.footerText : undefined,
          declarationText: patch.declarationText !== undefined ? patch.declarationText : undefined,
          notesText: patch.notesText !== undefined ? patch.notesText : undefined,
          logoFileUrl: patch.logoFileUrl !== undefined ? patch.logoFileUrl : undefined,
          themeConfig: patch.themeConfig !== undefined ? patch.themeConfig : undefined,
          version: { increment: 1 },
        },
      });
    });

    if (!updated) {
      return { ok: false, error: "Template not found" };
    }

    return { ok: true, data: toTemplateRecord(updated) };
  } catch (error) {
    console.error("[GST TEMPLATE] updateTemplate failed", {
      templateId,
      error: error instanceof Error ? error.message : String(error),
    });
    return { ok: false, error: "Failed to update template" };
  }
}

export async function listTemplates(gstSettingsId: string): Promise<GstServiceResult<GstInvoiceTemplateRecord[]>> {
  const settingsId = normalize(gstSettingsId);
  if (!settingsId) {
    return { ok: false, error: "gstSettingsId is required" };
  }
  try {
    const rows = await templateDb.gstInvoiceTemplate.findMany({
      where: { gstSettingsId: settingsId },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    });

    return { ok: true, data: rows.map(toTemplateRecord) };
  } catch (error) {
    console.error("[GST TEMPLATE] listTemplates failed", { error: error instanceof Error ? error.message : String(error) });
    return { ok: false, error: "Failed to list templates" };
  }
}

export async function setDefaultTemplate(id: string): Promise<GstServiceResult<{ updated: boolean }>> {
  const templateId = normalize(id);
  if (!templateId) {
    return { ok: false, error: "templateId is required" };
  }

  try {
    const result = await templateDb.$transaction(async (tx) => {
      const template = await tx.gstInvoiceTemplate.findUnique({
        where: { id: templateId },
        select: { id: true, gstSettingsId: true },
      });
      if (!template) {
        return { updated: false, missing: true };
      }

      await tx.gstInvoiceTemplate.updateMany({
        where: { gstSettingsId: String(template.gstSettingsId), isDefault: true },
        data: { isDefault: false },
      });
      await tx.gstInvoiceTemplate.update({
        where: { id: templateId },
        data: { isDefault: true, isActive: true, version: { increment: 1 } },
      });
      return { updated: true, missing: false };
    });

    if (result.missing) {
      return { ok: false, error: "Template not found" };
    }
    return { ok: true, data: { updated: result.updated } };
  } catch (error) {
    console.error("[GST TEMPLATE] setDefaultTemplate failed", { error: error instanceof Error ? error.message : String(error) });
    return { ok: false, error: "Failed to set default template" };
  }
}

export async function resolveTemplateForOrder(input: ResolveTemplateForOrderInput): Promise<GstServiceResult<GstInvoiceTemplateRecord | null>> {
  const gstSettingsId = normalize(input.gstSettingsId);
  if (!gstSettingsId) {
    return { ok: false, error: "gstSettingsId is required" };
  }

  try {
    if (input.orderImportId) {
      const order = await templateDb.gstOrderImport.findUnique({
        where: { id: normalize(input.orderImportId) },
        select: { id: true, gstSettingsId: true },
      });
      if (order && String(order.gstSettingsId) !== gstSettingsId) {
        return { ok: false, error: "orderImportId does not belong to gstSettingsId" };
      }
    }

    const template =
      (await templateDb.gstInvoiceTemplate.findFirst({
        where: { gstSettingsId, isDefault: true, isActive: true },
        orderBy: { updatedAt: "desc" },
      })) ||
      (await templateDb.gstInvoiceTemplate.findFirst({
        where: { gstSettingsId, isActive: true },
        orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
      })) ||
      (await templateDb.gstInvoiceTemplate.findFirst({
        where: { gstSettingsId },
        orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
      }));

    return { ok: true, data: template ? toTemplateRecord(template) : null };
  } catch (error) {
    console.error("[GST TEMPLATE] resolveTemplateForOrder failed", { error: error instanceof Error ? error.message : String(error) });
    return { ok: false, error: "Failed to resolve template" };
  }
}

export async function buildTemplatePreviewPayload(input: BuildTemplatePreviewPayloadInput): Promise<GstServiceResult<Record<string, unknown>>> {
  const templateId = normalize(input.templateId);
  if (!templateId) {
    return { ok: false, error: "templateId is required" };
  }

  try {
    const template = await templateDb.gstInvoiceTemplate.findUnique({ where: { id: templateId } });
    if (!template) {
      return { ok: false, error: "Template not found" };
    }

    let orderImport: Record<string, unknown> | null = null;
    if (input.orderImportId) {
      orderImport = await templateDb.gstOrderImport.findUnique({
        where: { id: normalize(input.orderImportId) },
        include: { lines: true },
      });
      if (!orderImport) {
        return { ok: false, error: "Order import not found" };
      }
    }

    const previewPayload: Record<string, unknown> = {
      preview: true,
      generatedAt: new Date().toISOString(),
      template: toTemplateRecord(template),
      order: orderImport ? buildPreviewOrderPayload(orderImport) : null,
    };

    return {
      ok: true,
      data: {
        ...previewPayload,
        ...(input.payloadOverrides || {}),
      },
    };
  } catch (error) {
    console.error("[GST TEMPLATE] buildTemplatePreviewPayload failed", {
      templateId,
      error: error instanceof Error ? error.message : String(error),
    });
    return { ok: false, error: "Failed to build template preview payload" };
  }
}

export async function getTemplateById(id: string): Promise<GstServiceResult<GstInvoiceTemplateRecord>> {
  const templateId = normalize(id);
  if (!templateId) {
    return { ok: false, error: "templateId is required" };
  }

  try {
    const row = await templateDb.gstInvoiceTemplate.findUnique({ where: { id: templateId } });
    if (!row) {
      return { ok: false, error: "Template not found" };
    }
    return { ok: true, data: toTemplateRecord(row) };
  } catch (error) {
    console.error("[GST TEMPLATE] getTemplateById failed", { templateId, error: error instanceof Error ? error.message : String(error) });
    return { ok: false, error: "Failed to load template" };
  }
}

export async function listActiveSettingsTemplates(): Promise<GstServiceResult<GstInvoiceTemplateRecord[]>> {
  const settings = await getActiveGstSettings();
  if (!settings.ok || !settings.data) {
    return { ok: false, error: settings.error || "No active GST settings configured" };
  }
  return listTemplates(settings.data.id);
}
