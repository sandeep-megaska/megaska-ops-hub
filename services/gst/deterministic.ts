import type { GstTaxBreakdown } from "./types";
import type { GstTaxLineComputation } from "./tax-engine";
import { round2 } from "./tax-engine";

export interface GstDeterministicValidationInput {
  lines: GstTaxLineComputation[];
  header: GstTaxBreakdown;
  expectedDiscountTotal?: number;
}

export interface GstDeterministicValidationCheck {
  check:
    | "LINE_TOTAL_EQUALS_HEADER_TOTAL"
    | "LINE_TAXABLE_EQUALS_HEADER_TAXABLE"
    | "TAX_COMPONENT_TOTALS_RECONCILE"
    | "DISCOUNT_ALLOCATION_RECONCILES"
    | "NO_UNEXPECTED_NEGATIVES";
  ok: boolean;
  expected: number | Record<string, number>;
  actual: number | Record<string, number>;
  message: string;
}

export interface GstDeterministicValidationResult {
  ok: boolean;
  checks: GstDeterministicValidationCheck[];
}

function sumLines(lines: GstTaxLineComputation[]) {
  return lines.reduce(
    (acc, line) => ({
      taxable: round2(acc.taxable + Number(line.taxableAmount || 0)),
      total: round2(acc.total + Number(line.lineTotal || 0)),
      cgst: round2(acc.cgst + Number(line.cgstAmount || 0)),
      sgst: round2(acc.sgst + Number(line.sgstAmount || 0)),
      igst: round2(acc.igst + Number(line.igstAmount || 0)),
      cess: round2(acc.cess + Number(line.cessAmount || 0)),
      discount: round2(acc.discount + Number(line.discount || 0)),
    }),
    {
      taxable: 0,
      total: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      cess: 0,
      discount: 0,
    },
  );
}

function equals2(a: number, b: number): boolean {
  return round2(a) === round2(b);
}

export function validateDeterministicTotals(
  input: GstDeterministicValidationInput,
): GstDeterministicValidationResult {
  const lineSums = sumLines(input.lines);
  const header = input.header;

  const taxExpected = {
    cgstAmount: round2(Number(header.cgstAmount || 0)),
    sgstAmount: round2(Number(header.sgstAmount || 0)),
    igstAmount: round2(Number(header.igstAmount || 0)),
    cessAmount: round2(Number(header.cessAmount || 0)),
  };

  const taxActual = {
    cgstAmount: lineSums.cgst,
    sgstAmount: lineSums.sgst,
    igstAmount: lineSums.igst,
    cessAmount: lineSums.cess,
  };

  const checks: GstDeterministicValidationCheck[] = [
    {
      check: "LINE_TOTAL_EQUALS_HEADER_TOTAL",
      ok: equals2(lineSums.total, header.totalAmount),
      expected: round2(Number(header.totalAmount || 0)),
      actual: lineSums.total,
      message: "sum(line totals) == header total",
    },
    {
      check: "LINE_TAXABLE_EQUALS_HEADER_TAXABLE",
      ok: equals2(lineSums.taxable, header.taxableAmount),
      expected: round2(Number(header.taxableAmount || 0)),
      actual: lineSums.taxable,
      message: "sum(line taxable) == header taxable",
    },
    {
      check: "TAX_COMPONENT_TOTALS_RECONCILE",
      ok:
        equals2(taxExpected.cgstAmount, taxActual.cgstAmount) &&
        equals2(taxExpected.sgstAmount, taxActual.sgstAmount) &&
        equals2(taxExpected.igstAmount, taxActual.igstAmount) &&
        equals2(taxExpected.cessAmount, taxActual.cessAmount),
      expected: taxExpected,
      actual: taxActual,
      message: "tax component totals reconcile",
    },
    {
      check: "DISCOUNT_ALLOCATION_RECONCILES",
      ok:
        typeof input.expectedDiscountTotal !== "number"
          ? true
          : equals2(lineSums.discount, input.expectedDiscountTotal),
      expected:
        typeof input.expectedDiscountTotal === "number"
          ? round2(input.expectedDiscountTotal)
          : lineSums.discount,
      actual: lineSums.discount,
      message: "discount allocation sums exactly",
    },
    {
      check: "NO_UNEXPECTED_NEGATIVES",
      ok: input.lines.every((line) => {
        const numericFields = [
          line.quantity,
          line.unitPrice,
          line.discount,
          line.taxableAmount,
          line.cgstAmount,
          line.sgstAmount,
          line.igstAmount,
          line.cessAmount,
          line.lineTotal,
        ];

        return numericFields.every((value) => Number(value) >= 0);
      }),
      expected: 0,
      actual: input.lines.reduce((min, line) => {
        const lineMin = Math.min(
          Number(line.quantity || 0),
          Number(line.unitPrice || 0),
          Number(line.discount || 0),
          Number(line.taxableAmount || 0),
          Number(line.cgstAmount || 0),
          Number(line.sgstAmount || 0),
          Number(line.igstAmount || 0),
          Number(line.cessAmount || 0),
          Number(line.lineTotal || 0),
        );
        return Math.min(min, lineMin);
      }, 0),
      message: "no unexpected negative values",
    },
  ];

  return {
    ok: checks.every((check) => check.ok),
    checks,
  };
}
