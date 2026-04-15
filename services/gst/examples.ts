import { determineSupplyType } from "./classifier";
import { buildDocumentNumber, formatDocumentSequence, getFinancialYearLabel } from "./numbering";
import { aggregateTaxTotals, allocateDiscountProRata, computeLineTax, splitTaxAmount } from "./tax-engine";

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
