import { Prisma } from "../../generated/prisma";
import { writeGstAuditLog } from "./audit";
import { classifySupply } from "./classifier";
import { gstDb } from "./db";
import { reserveGstNumber } from "./numbering";
import { getActiveGstSettings, getGstSettingsById } from "./settings";
import { computeTotals } from "./tax-engine";
import type { GstInvoiceDraftInput, GstServiceResult } from "./types";
import { validateDocumentDraftPayload } from "./validation";

export interface GstInvoiceDraftResult {
  id: string;
  documentNumber: string;
  status: "DRAFT";
}

function normalizeDate(value: Date | string | undefined): Date {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

async function ensureBuyerParty(input: GstInvoiceDraftInput) {
  const legalName = String(input.buyer?.legalName || "").trim();
  const gstin = String(input.buyer?.gstin || "")
    .trim()
    .toUpperCase();
  const stateCode = String(input.buyer?.stateCode || "").trim() || null;

  if (!legalName && !gstin) {
    return null;
  }

  if (gstin) {
    return gstDb.gstParty.upsert({
      where: { gstin },
      update: {
        legalName: legalName || "Unregistered Buyer",
        email: input.buyer?.email || null,
        phone: input.buyer?.phone || null,
        stateCode,
      },
      create: {
        gstin,
        legalName: legalName || "Unregistered Buyer",
        stateCode,
        email: input.buyer?.email || null,
        phone: input.buyer?.phone || null,
      },
    });
  }

  return gstDb.gstParty.upsert({
    where: {
      id: `ungst-${legalName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    },
    update: {
      legalName: legalName || "Unregistered Buyer",
      stateCode,
      email: input.buyer?.email || null,
      phone: input.buyer?.phone || null,
    },
    create: {
      id: `ungst-${legalName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      legalName: legalName || "Unregistered Buyer",
      stateCode,
      email: input.buyer?.email || null,
      phone: input.buyer?.phone || null,
      gstin: null,
    },
  });
}

export async function buildInvoiceDraft(
  input: GstInvoiceDraftInput
): Promise<GstServiceResult<GstInvoiceDraftResult>> {
  try {
    const payloadValidation = validateDocumentDraftPayload(input);
    if (!payloadValidation.ok || !payloadValidation.data) {
      return {
        ok: false,
        error: payloadValidation.error || "Invalid GST document payload",
      };
    }

    const payloadData = payloadValidation.data;
    const normalizedCurrency = payloadData.normalizedCurrency;

    const settingsResult = input.gstSettingsId
      ? await getGstSettingsById(input.gstSettingsId)
      : await getActiveGstSettings();

    if (!settingsResult.ok || !settingsResult.data) {
      return {
        ok: false,
        error: settingsResult.error || "Unable to resolve GST settings",
      };
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
      return {
        ok: false,
        error: classification.error || "GST classification failed",
      };
    }

    const classificationData = classification.data;

    const taxResult = computeTotals(
      input.lines,
      input.isInterstate ?? classificationData.isInterstate
    );

    if (!taxResult.ok || !taxResult.data) {
      return {
        ok: false,
        error: taxResult.error || "GST tax computation failed",
      };
    }

    const taxData = taxResult.data;

    const numberingResult = await reserveGstNumber({
      gstSettingsId: settings.id,
      documentType: "TAX_INVOICE",
      documentDate,
    });

    if (!numberingResult.ok || !numberingResult.data) {
      return {
        ok: false,
        error: numberingResult.error || "GST numbering failed",
      };
    }

    const numberingData = numberingResult.data;

    const buyerParty = await ensureBuyerParty(input);

    const snapshot = {
      settings,
      classification: classificationData,
      buyer: input.buyer || {},
      buyerParty,
      metadata: input.metadata || {},
      reverseCharge: Boolean(input.reverseCharge),
      source: {
        sourceOrderId: input.sourceOrderId || null,
        sourceOrderNumber: input.sourceOrderNumber || null,
        sourceReference: input.sourceReference || null,
        shopifyOrderId: input.shopifyOrderId || null,
        shopifyOrderName: input.shopifyOrderName || null,
      },
      computedAt: new Date().toISOString(),
      lines: taxData.lines,
      totals: taxData.totals,
    };

    const created = await gstDb.$transaction(async (tx) => {
      const document = await tx.gstDocument.create({
        data: {
          documentType: "TAX_INVOICE",
          status: "DRAFT",
          documentNumber: numberingData.documentNumber,
          documentDate,
          gstSettingsId: settings.id,
          shopifyOrderId: input.shopifyOrderId || null,
          shopifyOrderName: input.shopifyOrderName || null,
          sourceOrderId: input.sourceOrderId || null,
          sourceOrderNumber: input.sourceOrderNumber || null,
          sourceReference: input.sourceReference || null,
          supplyType: classificationData.supplyType,
          placeOfSupplyStateCode:
            input.placeOfSupplyStateCode ||
            classificationData.placeOfSupplyStateCode,
          isInterstate: input.isInterstate ?? classificationData.isInterstate,
          currency: normalizedCurrency,
          taxableAmount: new Prisma.Decimal(taxData.totals.taxableAmount),
          cgstAmount: new Prisma.Decimal(taxData.totals.cgstAmount),
          sgstAmount: new Prisma.Decimal(taxData.totals.sgstAmount),
          igstAmount: new Prisma.Decimal(taxData.totals.igstAmount),
          cessAmount: new Prisma.Decimal(taxData.totals.cessAmount),
          totalAmount: new Prisma.Decimal(taxData.totals.totalAmount),
          jsonSnapshot: snapshot,
          metadata: input.metadata || {},
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

    await writeGstAuditLog(
      {
        action: "GST_DOCUMENT_DRAFT_CREATED",
        gstSettingsId: settings.id,
        gstDocumentId: created.id,
        nextState: snapshot,
      },
      { actorType: "SYSTEM" }
    );

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
  gstDocumentId: string
): Promise<GstServiceResult<Record<string, unknown>>> {
  try {
    const document = await gstDb.gstDocument.findUnique({
      where: { id: String(gstDocumentId).trim() },
      include: {
        lines: { orderBy: { lineNumber: "asc" } },
        gstSettings: true,
        originalDocument: true,
      },
    });

    if (!document) {
      return { ok: false, error: "GST invoice not found" };
    }

    return { ok: true, data: { ...document } };
  } catch (error) {
    console.error("[GST INVOICE] getGstInvoiceById failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return { ok: false, error: "Failed to fetch GST invoice" };
  }
}
