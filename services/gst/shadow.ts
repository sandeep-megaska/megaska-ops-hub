import { classifySupply } from "./classifier";
import { validateDeterministicTotals } from "./deterministic";
import { aggregateTaxTotals, computeLineTax, round2 } from "./tax-engine";
import type { GstTaxLineComputation } from "./tax-engine";
import type { GstDocumentType, GstDocumentLineInput, GstServiceResult, GstSupplyType, GstTaxBreakdown } from "./types";

export type GstMismatchCategory =
  | "SETTINGS_MISMATCH"
  | "CLASSIFICATION_MISMATCH"
  | "LINE_TAXABLE_MISMATCH"
  | "TAX_SPLIT_MISMATCH"
  | "TOTAL_MISMATCH"
  | "NOTE_LINKAGE_MISMATCH"
  | "SNAPSHOT_MISSING_FIELD";

export interface GstShadowSourceOrder {
  sourceOrderId: string;
  sellerStateCode: string;
  billingStateCode?: string | null;
  shippingStateCode?: string | null;
  currency?: string;
  buyer?: {
    legalName?: string;
    gstin?: string | null;
    stateCode?: string | null;
  };
  lines: GstDocumentLineInput[];
  totalDiscount?: number;
  metadata?: Record<string, unknown>;
}

export interface GstShadowDocumentMetadata {
  sourceOrderId: string;
  placeOfSupplyStateCode: string;
  buyerGstin?: string | null;
  currency: string;
  documentDateIso: string;
  noteType?: Extract<GstDocumentType, "CREDIT_NOTE" | "DEBIT_NOTE">;
  originalDocumentNumber?: string;
}

export interface GstShadowDraftDocument {
  documentType: GstDocumentType;
  supplyType: GstSupplyType;
  isInterstate: boolean;
  lines: GstTaxLineComputation[];
  totals: GstTaxBreakdown;
  metadata: GstShadowDocumentMetadata;
  deterministicValidation: ReturnType<typeof validateDeterministicTotals>;
}

export interface GstProLikeReference {
  documentType?: GstDocumentType;
  supplyType?: GstSupplyType;
  isInterstate?: boolean;
  lines?: Array<{
    lineNumber?: number;
    taxableAmount?: number;
    cgstAmount?: number;
    sgstAmount?: number;
    igstAmount?: number;
  }>;
  totals?: Partial<GstTaxBreakdown>;
  metadata?: Record<string, unknown>;
}

export interface GstShadowMismatch {
  category: GstMismatchCategory;
  path: string;
  expected: unknown;
  actual: unknown;
  severity: "ERROR" | "WARN";
  message: string;
}

export interface GstShadowComparisonSummary {
  ok: boolean;
  mismatchCount: number;
  mismatchCategories: GstMismatchCategory[];
  mismatches: GstShadowMismatch[];
}

function createMetadata(
  source: GstShadowSourceOrder,
  placeOfSupplyStateCode: string,
  noteType?: Extract<GstDocumentType, "CREDIT_NOTE" | "DEBIT_NOTE">,
  originalDocumentNumber?: string,
): GstShadowDocumentMetadata {
  return {
    sourceOrderId: source.sourceOrderId,
    placeOfSupplyStateCode,
    buyerGstin: source.buyer?.gstin || null,
    currency: String(source.currency || "INR").toUpperCase(),
    documentDateIso: new Date().toISOString(),
    noteType,
    originalDocumentNumber,
  };
}

function computeShadowLines(lines: GstDocumentLineInput[], isInterstate: boolean): GstTaxLineComputation[] {
  return lines.map((line, index) => computeLineTax(line, isInterstate, index + 1));
}

export function buildShadowInvoiceDraft(
  source: GstShadowSourceOrder,
): GstServiceResult<GstShadowDraftDocument> {
  const classification = classifySupply({
    sellerStateCode: source.sellerStateCode,
    billingStateCode: source.billingStateCode,
    shippingStateCode: source.shippingStateCode,
    buyerGstin: source.buyer?.gstin,
  });

  if (!classification.ok || !classification.data) {
    return { ok: false, error: classification.error || "Unable to classify shadow invoice" };
  }
  const classificationData = classification.data;

  const lines = computeShadowLines(source.lines, classificationData.isInterstate);
  const totals = aggregateTaxTotals(lines);

  return {
    ok: true,
    data: {
      documentType: "TAX_INVOICE",
      supplyType: classificationData.supplyType,
      isInterstate: classificationData.isInterstate,
      lines,
      totals,
      metadata: createMetadata(source, classificationData.placeOfSupplyStateCode),
      deterministicValidation: validateDeterministicTotals({
        lines,
        header: totals,
        expectedDiscountTotal: source.totalDiscount,
      }),
    },
  };
}

export function buildShadowNoteDraft(
  source: GstShadowSourceOrder,
  noteType: Extract<GstDocumentType, "CREDIT_NOTE" | "DEBIT_NOTE">,
  originalDocumentNumber?: string,
): GstServiceResult<GstShadowDraftDocument> {
  const invoiceDraft = buildShadowInvoiceDraft(source);
  if (!invoiceDraft.ok || !invoiceDraft.data) {
    return { ok: false, error: invoiceDraft.error || "Unable to build note shadow draft" };
  }

  const base = invoiceDraft.data;
  return {
    ok: true,
    data: {
      ...base,
      documentType: noteType,
      metadata: createMetadata(
        source,
        base.metadata.placeOfSupplyStateCode,
        noteType,
        originalDocumentNumber,
      ),
    },
  };
}

function pushMismatch(
  mismatches: GstShadowMismatch[],
  mismatch: GstShadowMismatch,
) {
  mismatches.push(mismatch);
}

export function compareShadowWithReference(
  draft: GstShadowDraftDocument,
  reference: GstProLikeReference,
): GstShadowComparisonSummary {
  const mismatches: GstShadowMismatch[] = [];

  if (reference.supplyType && reference.supplyType !== draft.supplyType) {
    pushMismatch(mismatches, {
      category: "CLASSIFICATION_MISMATCH",
      path: "supplyType",
      expected: reference.supplyType,
      actual: draft.supplyType,
      severity: "ERROR",
      message: "Supply type differs from GST Pro-style reference",
    });
  }

  if (
    typeof reference.isInterstate === "boolean" &&
    reference.isInterstate !== draft.isInterstate
  ) {
    pushMismatch(mismatches, {
      category: "CLASSIFICATION_MISMATCH",
      path: "isInterstate",
      expected: reference.isInterstate,
      actual: draft.isInterstate,
      severity: "ERROR",
      message: "Interstate classification differs",
    });
  }

  if (reference.lines) {
    reference.lines.forEach((expectedLine, index) => {
      const actualLine = draft.lines[index];
      if (!actualLine) {
        pushMismatch(mismatches, {
          category: "SNAPSHOT_MISSING_FIELD",
          path: `lines[${index}]`,
          expected: expectedLine,
          actual: null,
          severity: "ERROR",
          message: "Expected line missing in shadow draft",
        });
        return;
      }

      if (
        typeof expectedLine.taxableAmount === "number" &&
        round2(expectedLine.taxableAmount) !== round2(actualLine.taxableAmount)
      ) {
        pushMismatch(mismatches, {
          category: "LINE_TAXABLE_MISMATCH",
          path: `lines[${index}].taxableAmount`,
          expected: round2(expectedLine.taxableAmount),
          actual: round2(actualLine.taxableAmount),
          severity: "ERROR",
          message: "Line taxable amount mismatch",
        });
      }

      const splitPairs: Array<keyof Pick<typeof expectedLine, "cgstAmount" | "sgstAmount" | "igstAmount">> = [
        "cgstAmount",
        "sgstAmount",
        "igstAmount",
      ];

      splitPairs.forEach((key) => {
        const expected = expectedLine[key];
        const actual = actualLine[key] as number;
        if (typeof expected === "number" && round2(expected) !== round2(actual)) {
          pushMismatch(mismatches, {
            category: "TAX_SPLIT_MISMATCH",
            path: `lines[${index}].${key}`,
            expected: round2(expected),
            actual: round2(actual),
            severity: "ERROR",
            message: `Tax split mismatch for ${key}`,
          });
        }
      });
    });
  }

  if (reference.totals) {
    const totalKeys: Array<keyof GstTaxBreakdown> = [
      "taxableAmount",
      "cgstAmount",
      "sgstAmount",
      "igstAmount",
      "cessAmount",
      "totalAmount",
    ];

    totalKeys.forEach((key) => {
      const expected = reference.totals?.[key];
      const actual = draft.totals[key];
      if (typeof expected === "number" && round2(expected) !== round2(actual)) {
        pushMismatch(mismatches, {
          category: key === "taxableAmount" ? "LINE_TAXABLE_MISMATCH" : "TOTAL_MISMATCH",
          path: `totals.${key}`,
          expected: round2(expected),
          actual: round2(actual),
          severity: "ERROR",
          message: `Total mismatch for ${key}`,
        });
      }
    });
  }

  if (draft.documentType !== "TAX_INVOICE" && !draft.metadata.originalDocumentNumber) {
    pushMismatch(mismatches, {
      category: "NOTE_LINKAGE_MISMATCH",
      path: "metadata.originalDocumentNumber",
      expected: "non-empty original document number",
      actual: draft.metadata.originalDocumentNumber,
      severity: "WARN",
      message: "Note draft missing original document linkage",
    });
  }

  const metadataRequiredFields = ["sourceOrderId", "placeOfSupplyStateCode", "currency", "documentDateIso"];
  metadataRequiredFields.forEach((field) => {
    if (!draft.metadata[field as keyof GstShadowDocumentMetadata]) {
      pushMismatch(mismatches, {
        category: "SNAPSHOT_MISSING_FIELD",
        path: `metadata.${field}`,
        expected: "non-empty",
        actual: draft.metadata[field as keyof GstShadowDocumentMetadata],
        severity: "ERROR",
        message: "Required metadata missing",
      });
    }
  });

  if (reference.metadata) {
    Object.entries(reference.metadata).forEach(([key, expected]) => {
      const actual = draft.metadata[key as keyof GstShadowDocumentMetadata];
      if (typeof expected !== "undefined" && typeof actual !== "undefined" && expected !== actual) {
        pushMismatch(mismatches, {
          category: "SETTINGS_MISMATCH",
          path: `metadata.${key}`,
          expected,
          actual,
          severity: "WARN",
          message: "Metadata setting mismatch against reference",
        });
      }
    });
  }

  const mismatchCategories = Array.from(new Set(mismatches.map((item) => item.category)));

  return {
    ok: mismatches.every((item) => item.severity !== "ERROR"),
    mismatchCount: mismatches.length,
    mismatchCategories,
    mismatches,
  };
}
