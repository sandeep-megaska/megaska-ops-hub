import { GST_DOCUMENT_TYPES } from "./constants";
import { gstDb } from "./db";
import type { GstDocumentType, GstServiceResult } from "./types";

export interface GstNumberRequest {
  gstSettingsId: string;
  documentType: GstDocumentType;
  documentDate: Date;
}

export interface GstReservedNumber {
  documentNumber: string;
  sequence: number;
  financialYear: string;
}

function normalize(value: string | null | undefined): string {
  return String(value ?? "").trim();
}

export function getFinancialYearLabel(documentDate: Date): string {
  const year = documentDate.getUTCFullYear();
  const month = documentDate.getUTCMonth() + 1;
  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;
  return `${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`;
}

export function formatDocumentSequence(sequence: number): string {
  return String(sequence).padStart(5, "0");
}

export function buildDocumentNumber(prefix: string, financialYear: string, sequence: number): string {
  return `${prefix}/${financialYear}/${formatDocumentSequence(sequence)}`;
}

export function pickPrefix(
  documentType: GstDocumentType,
  settings: { invoicePrefix: string; creditNotePrefix: string; debitNotePrefix: string },
): string {
  switch (documentType) {
    case "TAX_INVOICE":
      return normalize(settings.invoicePrefix);
    case "CREDIT_NOTE":
      return normalize(settings.creditNotePrefix);
    case "DEBIT_NOTE":
      return normalize(settings.debitNotePrefix);
    default:
      return "";
  }
}

function validateNumberingPrerequisites(request: GstNumberRequest): GstServiceResult<true> {
  if (!normalize(request.gstSettingsId)) {
    return { ok: false, error: "GST settings are required before reserving numbers" };
  }

  if (!GST_DOCUMENT_TYPES.includes(request.documentType)) {
    return { ok: false, error: `Unsupported documentType for numbering: ${String(request.documentType)}` };
  }

  if (!(request.documentDate instanceof Date) || Number.isNaN(request.documentDate.getTime())) {
    return { ok: false, error: "Valid documentDate is required for numbering" };
  }

  return { ok: true, data: true };
}

export async function reserveGstNumber(
  request: GstNumberRequest,
): Promise<GstServiceResult<GstReservedNumber>> {
  const prerequisites = validateNumberingPrerequisites(request);
  if (!prerequisites.ok) {
    return { ok: false, error: prerequisites.error };
  }

  try {
    const settings = await gstDb.gstSettings.findUnique({
      where: { id: request.gstSettingsId },
      select: {
        id: true,
        isActive: true,
        invoicePrefix: true,
        creditNotePrefix: true,
        debitNotePrefix: true,
      },
    });

    if (!settings) {
      return { ok: false, error: "GST settings not found for numbering" };
    }

    const prefix = pickPrefix(request.documentType, settings);
    if (!prefix) {
      return {
        ok: false,
        error: `Numbering prefix not configured for ${request.documentType}. Update GST settings and try again.`,
      };
    }

    const financialYear = getFinancialYearLabel(request.documentDate);

    const result = await gstDb.$transaction(async (tx) => {
      await tx.gstCounter.upsert({
        where: {
          gstSettingsId_documentType_financialYear: {
            gstSettingsId: request.gstSettingsId,
            documentType: request.documentType,
            financialYear,
          },
        },
        create: {
          gstSettingsId: request.gstSettingsId,
          documentType: request.documentType,
          financialYear,
          lastNumber: 0,
        },
        update: {},
      });

      const counter = await tx.gstCounter.update({
        where: {
          gstSettingsId_documentType_financialYear: {
            gstSettingsId: request.gstSettingsId,
            documentType: request.documentType,
            financialYear,
          },
        },
        data: {
          lastNumber: {
            increment: 1,
          },
        },
      });

      return {
        documentNumber: buildDocumentNumber(prefix, financialYear, counter.lastNumber),
        sequence: counter.lastNumber,
        financialYear,
      };
    });

    console.info("[GST NUMBERING] Reserved GST document number", {
      gstSettingsId: request.gstSettingsId,
      documentType: request.documentType,
      documentNumber: result.documentNumber,
      isActiveSettings: Boolean(settings.isActive),
    });

    return { ok: true, data: result };
  } catch (error) {
    console.error("[GST NUMBERING] reserveGstNumber failed", {
      error: error instanceof Error ? error.message : String(error),
      gstSettingsId: request.gstSettingsId,
      documentType: request.documentType,
    });

    return { ok: false, error: "Failed to reserve GST document number" };
  }
}
