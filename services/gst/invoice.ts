import { Prisma } from "../../generated/prisma";
import { prisma } from "../db/prisma";
import { classifySupply } from "./classifier";
import { reserveGstNumber } from "./numbering";
import { getActiveGstSettings, getGstSettingsById } from "./settings";
import { computeTotals } from "./tax-engine";
import type { GstInvoiceDraftInput, GstServiceResult } from "./types";
const db = prisma as any;

export interface GstInvoiceDraftResult {
  id: string;
  documentNumber: string;
  status: "DRAFT";
}

function normalizeDate(value: Date | string | undefined): Date {
  if (!value) {
    return new Date();
  }

  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export async function buildInvoiceDraft(
  input: GstInvoiceDraftInput,
): Promise<GstServiceResult<GstInvoiceDraftResult>> {
  try {
    const settingsResult = input.gstSettingsId
      ? await getGstSettingsById(input.gstSettingsId)
      : await getActiveGstSettings();

    if (!settingsResult.ok || !settingsResult.data) {
      return { ok: false, error: settingsResult.error || "Unable to resolve GST settings" };
    }

    const settings = settingsResult.data;
    const documentDate = normalizeDate(input.documentDate);

    const classification = classifySupply({
      sellerStateCode: settings.stateCode,
      billingStateCode: input.billingStateCode,
      shippingStateCode: input.shippingStateCode,
      buyerGstin: input.buyer?.gstin,
      explicitSupplyType: input.supplyType,
    });

    if (!classification.ok || !classification.data) {
      return { ok: false, error: classification.error || "GST classification failed" };
    }
    const classificationData = classification.data;

    const taxResult = computeTotals(
      input.lines,
      input.isInterstate ?? classification.data.isInterstate,
    );

    if (!taxResult.ok || !taxResult.data) {
      return { ok: false, error: taxResult.error || "GST tax computation failed" };
    }
    const taxData = taxResult.data;

    const numberingResult = await reserveGstNumber({
      gstSettingsId: settings.id,
      documentType: "TAX_INVOICE",
      documentDate,
    });

    if (!numberingResult.ok || !numberingResult.data) {
      return { ok: false, error: numberingResult.error || "GST numbering failed" };
    }
    const numberingData = numberingResult.data;

    const snapshot = {
      settings,
      classification: classificationData,
      buyer: input.buyer || {},
      metadata: input.metadata || {},
      computedAt: new Date().toISOString(),
      lines: taxData.lines,
      totals: taxData.totals,
    };

    const created = await db.$transaction(async (tx: any) => {
      const document = await tx.gstDocument.create({
        data: {
          documentType: "TAX_INVOICE",
          status: "DRAFT",
          documentNumber: numberingData.documentNumber,
          documentDate,
          gstSettingsId: settings.id,
          supplyType: classificationData.supplyType,
          placeOfSupplyStateCode:
            input.placeOfSupplyStateCode || classificationData.placeOfSupplyStateCode,
          isInterstate: input.isInterstate ?? classificationData.isInterstate,
          currency: input.currency || settings.defaultCurrency || "INR",
          taxableAmount: new Prisma.Decimal(taxData.totals.taxableAmount),
          cgstAmount: new Prisma.Decimal(taxData.totals.cgstAmount),
          sgstAmount: new Prisma.Decimal(taxData.totals.sgstAmount),
          igstAmount: new Prisma.Decimal(taxData.totals.igstAmount),
          cessAmount: new Prisma.Decimal(taxData.totals.cessAmount),
          totalAmount: new Prisma.Decimal(taxData.totals.totalAmount),
          jsonSnapshot: snapshot,
        },
      });

      await tx.gstDocumentLine.createMany({
        data: taxData.lines.map((line) => ({
          gstDocumentId: document.id,
          lineNumber: line.lineNumber,
          description: line.description,
          hsnOrSac: line.hsnOrSac || null,
          quantity: new Prisma.Decimal(line.quantity),
          unit: line.unit || null,
          unitPrice: new Prisma.Decimal(line.unitPrice),
          discount: new Prisma.Decimal(line.discount),
          taxableAmount: new Prisma.Decimal(line.taxableAmount),
          taxRate: new Prisma.Decimal(line.taxRate),
          cgstAmount: new Prisma.Decimal(line.cgstAmount),
          sgstAmount: new Prisma.Decimal(line.sgstAmount),
          igstAmount: new Prisma.Decimal(line.igstAmount),
          cessAmount: new Prisma.Decimal(line.cessAmount),
          lineTotal: new Prisma.Decimal(line.lineTotal),
        })),
      });

      return document;
    });

    console.info("[GST INVOICE] Created draft GST invoice", {
      gstDocumentId: created.id,
      documentNumber: created.documentNumber,
    });

    return {
      ok: true,
      data: {
        id: created.id,
        documentNumber: created.documentNumber,
        status: "DRAFT",
      },
    };
  } catch (error) {
    console.error("[GST INVOICE] buildInvoiceDraft failed", {
      error: error instanceof Error ? error.message : String(error),
    });

    return { ok: false, error: "Failed to create GST invoice draft" };
  }
}

export async function getGstInvoiceById(
  gstDocumentId: string,
): Promise<GstServiceResult<Record<string, unknown>>> {
  try {
    const document = await db.gstDocument.findUnique({
      where: { id: String(gstDocumentId).trim() },
      include: {
        lines: {
          orderBy: { lineNumber: "asc" },
        },
        gstSettings: true,
      },
    });

    if (!document) {
      return { ok: false, error: "GST invoice not found" };
    }

    return {
      ok: true,
      data: {
        ...document,
      },
    };
  } catch (error) {
    console.error("[GST INVOICE] getGstInvoiceById failed", {
      error: error instanceof Error ? error.message : String(error),
    });

    return { ok: false, error: "Failed to fetch GST invoice" };
  }
}
