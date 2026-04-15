import { prisma } from "../db/prisma";
import type { GstDocumentType, GstServiceResult } from "./types";
const db = prisma as any;

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

function getFinancialYearLabel(documentDate: Date): string {
  const year = documentDate.getUTCFullYear();
  const month = documentDate.getUTCMonth() + 1;
  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;
  return `${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`;
}

function formatNumber(sequence: number): string {
  return String(sequence).padStart(5, "0");
}

function buildDocumentNumber(prefix: string, financialYear: string, sequence: number): string {
  return `${prefix}/${financialYear}/${formatNumber(sequence)}`;
}

function pickPrefix(documentType: GstDocumentType, settings: { invoicePrefix: string; creditNotePrefix: string; debitNotePrefix: string }): string {
  switch (documentType) {
    case "TAX_INVOICE":
      return settings.invoicePrefix;
    case "CREDIT_NOTE":
      return settings.creditNotePrefix;
    case "DEBIT_NOTE":
      return settings.debitNotePrefix;
    default:
      return settings.invoicePrefix;
  }
}

export async function reserveGstNumber(
  request: GstNumberRequest,
): Promise<GstServiceResult<GstReservedNumber>> {
  try {
    const settings = await db.gstSettings.findUnique({
      where: { id: request.gstSettingsId },
      select: {
        id: true,
        invoicePrefix: true,
        creditNotePrefix: true,
        debitNotePrefix: true,
      },
    });

    if (!settings) {
      return { ok: false, error: "GST settings not found for numbering" };
    }

    const financialYear = getFinancialYearLabel(request.documentDate);

    const result = await db.$transaction(async (tx: any) => {
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

      const prefix = pickPrefix(request.documentType, settings);
      const documentNumber = buildDocumentNumber(prefix, financialYear, counter.lastNumber);

      return {
        documentNumber,
        sequence: counter.lastNumber,
        financialYear,
      };
    });

    console.info("[GST NUMBERING] Reserved GST document number", {
      gstSettingsId: request.gstSettingsId,
      documentType: request.documentType,
      documentNumber: result.documentNumber,
    });

    return { ok: true, data: result };
  } catch (error) {
    console.error("[GST NUMBERING] reserveGstNumber failed", {
      error: error instanceof Error ? error.message : String(error),
    });

    return { ok: false, error: "Failed to reserve GST document number" };
  }
}
