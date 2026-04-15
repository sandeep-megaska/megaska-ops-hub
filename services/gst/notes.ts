import { getGstInvoiceById } from "./invoice";
import { reserveGstNumber } from "./numbering";
import { getActiveGstSettings, getGstSettingsById } from "./settings";
import { computeTotals } from "./tax-engine";
import type { GstDocumentType, GstInvoiceDraftInput, GstServiceResult } from "./types";

export interface GstNoteDraftInput extends GstInvoiceDraftInput {
  noteType: Extract<GstDocumentType, "CREDIT_NOTE" | "DEBIT_NOTE">;
  originalDocumentId?: string;
}

export interface GstNoteDraftScaffold {
  documentType: "CREDIT_NOTE" | "DEBIT_NOTE";
  documentNumber: string;
  originalDocumentId?: string;
  totals?: {
    taxableAmount: number;
    totalAmount: number;
  };
  persistenceImplemented: false;
}

export async function buildNoteDraft(
  input: GstNoteDraftInput,
): Promise<GstServiceResult<GstNoteDraftScaffold>> {
  try {
    const settingsResult = input.gstSettingsId
      ? await getGstSettingsById(input.gstSettingsId)
      : await getActiveGstSettings();

    if (!settingsResult.ok || !settingsResult.data) {
      return { ok: false, error: settingsResult.error || "Unable to resolve GST settings" };
    }

    if (input.originalDocumentId) {
      const original = await getGstInvoiceById(input.originalDocumentId);
      if (!original.ok) {
        return { ok: false, error: "Original GST document not found" };
      }
    }

    const documentDate = input.documentDate ? new Date(input.documentDate) : new Date();
    const numbering = await reserveGstNumber({
      gstSettingsId: settingsResult.data.id,
      documentType: input.noteType,
      documentDate,
    });

    if (!numbering.ok || !numbering.data) {
      return { ok: false, error: numbering.error || "Unable to reserve note number" };
    }

    const tax = computeTotals(input.lines, Boolean(input.isInterstate));

    return {
      ok: true,
      data: {
        documentType: input.noteType,
        documentNumber: numbering.data.documentNumber,
        originalDocumentId: input.originalDocumentId,
        totals: tax.ok && tax.data
          ? {
              taxableAmount: tax.data.totals.taxableAmount,
              totalAmount: tax.data.totals.totalAmount,
            }
          : undefined,
        persistenceImplemented: false,
      },
    };
  } catch (error) {
    console.error("[GST INVOICE] buildNoteDraft scaffold failed", {
      error: error instanceof Error ? error.message : String(error),
    });

    return { ok: false, error: "Failed to scaffold GST note draft" };
  }
}
