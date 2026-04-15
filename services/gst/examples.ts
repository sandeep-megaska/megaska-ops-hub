import { determineSupplyType } from "./classifier";
import { buildDocumentNumber, formatDocumentSequence, getFinancialYearLabel } from "./numbering";
import { aggregateTaxTotals, allocateDiscountProRata, computeLineTax, splitTaxAmount } from "./tax-engine";
import type { GstDocumentType, GstDocumentLineInput, GstSupplyType } from "./types";

/**
 * Lightweight validation harness for GST pure helpers when formal test infra is unavailable.
 * Run manually from a TS runtime or adapt into automated tests.
 */
export function runGstHelperExamples() {
  const fy = getFinancialYearLabel(new Date("2026-04-01T00:00:00.000Z"));
  const seq = formatDocumentSequence(27);
  const docNo = buildDocumentNumber("INV", fy, 27);

  const supplyType = determineSupplyType({ buyerGstin: "29ABCDE1234F1Z5" });

  const discountAllocation = allocateDiscountProRata({
    totalDiscount: 30,
    lines: [
      { description: "Line 1", quantity: 1, unitPrice: 100, taxRate: 18 },
      { description: "Line 2", quantity: 1, unitPrice: 200, taxRate: 18 },
    ],
  });

  const lineTax = computeLineTax(
    { description: "Line 1", quantity: 2, unitPrice: 50, discount: 10, taxRate: 18 },
    false,
    1,
  );

  const taxSplit = splitTaxAmount(90, 18, false);
  const totals = aggregateTaxTotals([lineTax]);

  return {
    fy,
    seq,
    docNo,
    supplyType,
    discountAllocation,
    taxSplit,
    totals,
  };
}

export interface GstExampleScenario {
  key:
    | "B2C_INTRA_STATE_ORDER"
    | "B2C_INTER_STATE_ORDER"
    | "B2B_INTRA_STATE_ORDER"
    | "B2B_INTER_STATE_ORDER"
    | "PARTIAL_REFUND_CREDIT_NOTE"
    | "FULL_REFUND_CREDIT_NOTE"
    | "DEBIT_NOTE_ADJUSTMENT";
  documentType: GstDocumentType;
  supplyType: GstSupplyType;
  sourceOrderId: string;
  sellerStateCode: string;
  billingStateCode: string;
  shippingStateCode: string;
  buyer: {
    legalName: string;
    gstin?: string;
    stateCode: string;
  };
  lines: GstDocumentLineInput[];
  totalDiscount: number;
  originalDocumentNumber?: string;
  noteType?: Extract<GstDocumentType, "CREDIT_NOTE" | "DEBIT_NOTE">;
  reference: {
    supplyType: GstSupplyType;
    isInterstate: boolean;
  };
}

const baseLines: GstDocumentLineInput[] = [
  {
    description: "Sneaker pair",
    quantity: 1,
    unitPrice: 1999,
    taxRate: 12,
    hsnOrSac: "640411",
    discount: 199,
  },
  {
    description: "Socks combo",
    quantity: 2,
    unitPrice: 199,
    taxRate: 5,
    hsnOrSac: "611595",
    discount: 0,
  },
];

export const GST_EXAMPLE_SCENARIOS: GstExampleScenario[] = [
  {
    key: "B2C_INTRA_STATE_ORDER",
    documentType: "TAX_INVOICE",
    supplyType: "B2C",
    sourceOrderId: "ORDER-B2C-INTRA-001",
    sellerStateCode: "27",
    billingStateCode: "27",
    shippingStateCode: "27",
    buyer: { legalName: "Walk-in Customer", stateCode: "27" },
    lines: baseLines,
    totalDiscount: 199,
    reference: { supplyType: "B2C", isInterstate: false },
  },
  {
    key: "B2C_INTER_STATE_ORDER",
    documentType: "TAX_INVOICE",
    supplyType: "B2C",
    sourceOrderId: "ORDER-B2C-INTER-001",
    sellerStateCode: "27",
    billingStateCode: "29",
    shippingStateCode: "29",
    buyer: { legalName: "Walk-in Customer", stateCode: "29" },
    lines: baseLines,
    totalDiscount: 199,
    reference: { supplyType: "B2C", isInterstate: true },
  },
  {
    key: "B2B_INTRA_STATE_ORDER",
    documentType: "TAX_INVOICE",
    supplyType: "B2B",
    sourceOrderId: "ORDER-B2B-INTRA-001",
    sellerStateCode: "27",
    billingStateCode: "27",
    shippingStateCode: "27",
    buyer: { legalName: "Acme Retail LLP", gstin: "27ABCDE1234F1Z5", stateCode: "27" },
    lines: baseLines,
    totalDiscount: 199,
    reference: { supplyType: "B2B", isInterstate: false },
  },
  {
    key: "B2B_INTER_STATE_ORDER",
    documentType: "TAX_INVOICE",
    supplyType: "B2B",
    sourceOrderId: "ORDER-B2B-INTER-001",
    sellerStateCode: "27",
    billingStateCode: "29",
    shippingStateCode: "29",
    buyer: { legalName: "Acme Retail LLP", gstin: "29ABCDE1234F1Z5", stateCode: "29" },
    lines: baseLines,
    totalDiscount: 199,
    reference: { supplyType: "B2B", isInterstate: true },
  },
  {
    key: "PARTIAL_REFUND_CREDIT_NOTE",
    documentType: "CREDIT_NOTE",
    noteType: "CREDIT_NOTE",
    supplyType: "B2C",
    sourceOrderId: "ORDER-REFUND-PARTIAL-001",
    sellerStateCode: "27",
    billingStateCode: "27",
    shippingStateCode: "27",
    buyer: { legalName: "Walk-in Customer", stateCode: "27" },
    lines: [
      {
        description: "Sneaker pair return",
        quantity: 1,
        unitPrice: 500,
        taxRate: 12,
        hsnOrSac: "640411",
        discount: 0,
      },
    ],
    totalDiscount: 0,
    originalDocumentNumber: "INV/2026-27/000001",
    reference: { supplyType: "B2C", isInterstate: false },
  },
  {
    key: "FULL_REFUND_CREDIT_NOTE",
    documentType: "CREDIT_NOTE",
    noteType: "CREDIT_NOTE",
    supplyType: "B2C",
    sourceOrderId: "ORDER-REFUND-FULL-001",
    sellerStateCode: "27",
    billingStateCode: "27",
    shippingStateCode: "27",
    buyer: { legalName: "Walk-in Customer", stateCode: "27" },
    lines: baseLines,
    totalDiscount: 199,
    originalDocumentNumber: "INV/2026-27/000002",
    reference: { supplyType: "B2C", isInterstate: false },
  },
  {
    key: "DEBIT_NOTE_ADJUSTMENT",
    documentType: "DEBIT_NOTE",
    noteType: "DEBIT_NOTE",
    supplyType: "B2B",
    sourceOrderId: "ORDER-DEBIT-ADJ-001",
    sellerStateCode: "27",
    billingStateCode: "29",
    shippingStateCode: "29",
    buyer: { legalName: "Acme Retail LLP", gstin: "29ABCDE1234F1Z5", stateCode: "29" },
    lines: [
      {
        description: "Post-sale price correction",
        quantity: 1,
        unitPrice: 250,
        taxRate: 18,
        hsnOrSac: "998599",
        discount: 0,
      },
    ],
    totalDiscount: 0,
    originalDocumentNumber: "INV/2026-27/000101",
    reference: { supplyType: "B2B", isInterstate: true },
  },
];
