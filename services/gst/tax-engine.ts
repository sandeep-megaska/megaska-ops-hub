import type {
  GstDocumentLineInput,
  GstServiceResult,
  GstTaxBreakdown,
} from "./types";

export function computeTotals(
  lines: GstDocumentLineInput[],
): GstServiceResult<GstTaxBreakdown> {
  const taxableAmount = lines.reduce((sum, line) => {
    const discount = line.discount ?? 0;
    return sum + line.quantity * line.unitPrice - discount;
  }, 0);

  return {
    ok: true,
    data: {
      taxableAmount,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      cessAmount: 0,
      totalAmount: taxableAmount,
    },
  };
}
