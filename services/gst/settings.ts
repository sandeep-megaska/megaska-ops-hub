import { prisma } from "../db/prisma";
import type { GstServiceResult } from "./types";
const db = prisma as any;

export interface GstSettingsSnapshot {
  id: string;
  legalName: string;
  tradeName: string | null;
  gstin: string;
  pan: string | null;
  stateCode: string;
  invoicePrefix: string;
  creditNotePrefix: string;
  debitNotePrefix: string;
  invoiceNumberStrategy: "FINANCIAL_YEAR_SEQUENCE" | "CALENDAR_YEAR_SEQUENCE" | "MONTHLY_SEQUENCE" | "MANUAL";
  defaultCurrency: string;
  einvoiceEnabled: boolean;
  isActive: boolean;
}

export interface GstSettingsWriteInput {
  legalName: string;
  tradeName?: string | null;
  gstin: string;
  pan?: string | null;
  stateCode: string;
  invoicePrefix: string;
  creditNotePrefix: string;
  debitNotePrefix: string;
  invoiceNumberStrategy?: GstSettingsSnapshot["invoiceNumberStrategy"];
  defaultCurrency?: string;
  einvoiceEnabled?: boolean;
  isActive?: boolean;
}

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const STATE_CODE_REGEX = /^[0-9]{2}$/;
const PREFIX_REGEX = /^[A-Z0-9/_-]{1,12}$/;

function normalize(value: string | null | undefined): string {
  return String(value ?? "").trim();
}

function toSnapshot(settings: any): GstSettingsSnapshot | undefined {
  if (!settings) {
    return undefined;
  }

  return {
    id: settings.id,
    legalName: settings.legalName,
    tradeName: settings.tradeName,
    gstin: settings.gstin,
    pan: settings.pan,
    stateCode: settings.stateCode,
    invoicePrefix: settings.invoicePrefix,
    creditNotePrefix: settings.creditNotePrefix,
    debitNotePrefix: settings.debitNotePrefix,
    invoiceNumberStrategy: settings.invoiceNumberStrategy,
    defaultCurrency: settings.defaultCurrency,
    einvoiceEnabled: settings.einvoiceEnabled,
    isActive: settings.isActive,
  };
}

export function validateGstIdentityConfig(
  input: Partial<GstSettingsWriteInput>,
): GstServiceResult<{ normalized?: Partial<GstSettingsWriteInput>; messages?: string[] }> {
  const errors: string[] = [];

  const legalName = normalize(input.legalName);
  const gstin = normalize(input.gstin).toUpperCase();
  const pan = normalize(input.pan).toUpperCase();
  const stateCode = normalize(input.stateCode);
  const invoicePrefix = normalize(input.invoicePrefix).toUpperCase();
  const creditNotePrefix = normalize(input.creditNotePrefix).toUpperCase();
  const debitNotePrefix = normalize(input.debitNotePrefix).toUpperCase();

  if (!legalName) {
    errors.push("legalName is required");
  }
  if (!GSTIN_REGEX.test(gstin)) {
    errors.push("gstin must be a valid 15-character GSTIN");
  }
  if (pan && !PAN_REGEX.test(pan)) {
    errors.push("pan must be a valid PAN");
  }
  if (!STATE_CODE_REGEX.test(stateCode)) {
    errors.push("stateCode must be a 2-digit GST state code");
  }
  if (!PREFIX_REGEX.test(invoicePrefix)) {
    errors.push("invoicePrefix must be 1-12 chars and contain A-Z, 0-9, /, _, -");
  }
  if (!PREFIX_REGEX.test(creditNotePrefix)) {
    errors.push("creditNotePrefix must be 1-12 chars and contain A-Z, 0-9, /, _, -");
  }
  if (!PREFIX_REGEX.test(debitNotePrefix)) {
    errors.push("debitNotePrefix must be 1-12 chars and contain A-Z, 0-9, /, _, -");
  }
  if (gstin && stateCode && gstin.slice(0, 2) !== stateCode) {
    errors.push("gstin state code and stateCode must match");
  }
  if (pan && gstin && gstin.slice(2, 12) !== pan) {
    errors.push("gstin PAN segment and pan must match");
  }

  if (errors.length > 0) {
    return { ok: false, error: errors.join("; "), data: { messages: errors } };
  }

  return {
    ok: true,
    data: {
      normalized: {
        legalName,
        tradeName: normalize(input.tradeName) || null,
        gstin,
        pan: pan || null,
        stateCode,
        invoicePrefix,
        creditNotePrefix,
        debitNotePrefix,
        invoiceNumberStrategy: input.invoiceNumberStrategy ?? "FINANCIAL_YEAR_SEQUENCE",
        defaultCurrency: normalize(input.defaultCurrency || "INR").toUpperCase(),
        einvoiceEnabled: Boolean(input.einvoiceEnabled),
        isActive: input.isActive ?? true,
      },
    },
  };
}

export async function getGstSettingsById(id: string): Promise<GstServiceResult<GstSettingsSnapshot>> {
  try {
    const settings = await db.gstSettings.findUnique({ where: { id: normalize(id) } });
    if (!settings) {
      return { ok: false, error: "GST settings not found" };
    }

    return { ok: true, data: toSnapshot(settings) };
  } catch (error) {
    console.error("[GST SETTINGS] getGstSettingsById failed", { error: error instanceof Error ? error.message : String(error) });
    return { ok: false, error: "Failed to load GST settings" };
  }
}

export async function getActiveGstSettings(): Promise<GstServiceResult<GstSettingsSnapshot>> {
  try {
    const settings = await db.gstSettings.findFirst({ where: { isActive: true }, orderBy: { updatedAt: "desc" } });
    if (!settings) {
      return { ok: false, error: "No active GST settings configured" };
    }

    return { ok: true, data: toSnapshot(settings) };
  } catch (error) {
    console.error("[GST SETTINGS] getActiveGstSettings failed", { error: error instanceof Error ? error.message : String(error) });
    return { ok: false, error: "Failed to load active GST settings" };
  }
}

export async function upsertGstSettings(input: GstSettingsWriteInput): Promise<GstServiceResult<GstSettingsSnapshot>> {
  const validation = validateGstIdentityConfig(input);
  if (!validation.ok || !validation.data?.normalized) {
    return { ok: false, error: validation.error || "Invalid GST settings" };
  }

  const normalized = validation.data.normalized;

  try {
    const created = await db.$transaction(async (tx: any) => {
      if (normalized.isActive) {
        await tx.gstSettings.updateMany({ where: { isActive: true }, data: { isActive: false } });
      }

      return tx.gstSettings.upsert({
        where: { gstin: String(normalized.gstin) },
        create: {
          legalName: String(normalized.legalName),
          tradeName: normalized.tradeName ?? null,
          gstin: String(normalized.gstin),
          pan: normalized.pan ?? null,
          stateCode: String(normalized.stateCode),
          invoicePrefix: String(normalized.invoicePrefix),
          creditNotePrefix: String(normalized.creditNotePrefix),
          debitNotePrefix: String(normalized.debitNotePrefix),
          invoiceNumberStrategy: normalized.invoiceNumberStrategy,
          defaultCurrency: String(normalized.defaultCurrency || "INR"),
          einvoiceEnabled: Boolean(normalized.einvoiceEnabled),
          isActive: normalized.isActive ?? true,
        },
        update: {
          legalName: String(normalized.legalName),
          tradeName: normalized.tradeName ?? null,
          pan: normalized.pan ?? null,
          stateCode: String(normalized.stateCode),
          invoicePrefix: String(normalized.invoicePrefix),
          creditNotePrefix: String(normalized.creditNotePrefix),
          debitNotePrefix: String(normalized.debitNotePrefix),
          invoiceNumberStrategy: normalized.invoiceNumberStrategy,
          defaultCurrency: String(normalized.defaultCurrency || "INR"),
          einvoiceEnabled: Boolean(normalized.einvoiceEnabled),
          isActive: normalized.isActive ?? true,
        },
      });
    });

    console.info("[GST SETTINGS] upserted GST settings", { gstSettingsId: created.id, gstin: created.gstin });
    return { ok: true, data: toSnapshot(created) };
  } catch (error) {
    console.error("[GST SETTINGS] upsertGstSettings failed", { error: error instanceof Error ? error.message : String(error) });
    return { ok: false, error: "Failed to save GST settings" };
  }
}
