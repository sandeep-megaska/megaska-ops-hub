import type {
  GstDocumentLineInput,
  GstServiceResult,
  GstTaxBreakdown,
} from "./types";

export interface GstTaxLineComputation {
  lineNumber: number;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cessAmount: number;
  lineTotal: number;
  hsnOrSac?: string;
  unit?: string;
}

export interface GstAllocationInput {
  lines: GstDocumentLineInput[];
  totalDiscount: number;
}

const ROUND_SCALE = 100;

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * ROUND_SCALE) / ROUND_SCALE;
}

function sanitizeLine(line: GstDocumentLineInput): GstDocumentLineInput {
  return {
    ...line,
    quantity: Number(line.quantity || 0),
    unitPrice: Number(line.unitPrice || 0),
    taxRate: Number(line.taxRate || 0),
    discount: Number(line.discount || 0),
  };
}

export function allocateDiscountProRata(input: GstAllocationInput): GstServiceResult<GstDocumentLineInput[]> {
  const lines = input.lines.map(sanitizeLine);
  const totalDiscount = Number(input.totalDiscount || 0);
  if (totalDiscount < 0) {
    return { ok: false, error: "totalDiscount cannot be negative" };
  }

  const grossTotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  if (grossTotal <= 0 || totalDiscount === 0) {
    return { ok: true, data: lines };
  }

  let allocated = 0;

  const adjusted = lines.map((line, index) => {
    if (index === lines.length - 1) {
      const remainder = round2(totalDiscount - allocated);
      return {
        ...line,
        discount: round2((line.discount || 0) + remainder),
      };
    }

    const ratio = (line.quantity * line.unitPrice) / grossTotal;
    const share = round2(totalDiscount * ratio);
    allocated = round2(allocated + share);
    return {
      ...line,
      discount: round2((line.discount || 0) + share),
    };
  });

  return { ok: true, data: adjusted };
}

export function computeLineTax(line: GstDocumentLineInput, isInterstate: boolean, lineNumber: number): GstTaxLineComputation {
  const safe = sanitizeLine(line);
  const gross = round2(safe.quantity * safe.unitPrice);
  const discount = round2(Math.min(gross, Math.max(0, safe.discount || 0)));
  const taxableAmount = round2(Math.max(0, gross - discount));
  const taxAmount = round2((taxableAmount * safe.taxRate) / 100);

  const igstAmount = isInterstate ? taxAmount : 0;
  const halfTax = isInterstate ? 0 : round2(taxAmount / 2);

  return {
    lineNumber,
    description: safe.description,
    quantity: safe.quantity,
    unitPrice: safe.unitPrice,
    discount,
    taxRate: safe.taxRate,
    taxableAmount,
    cgstAmount: halfTax,
    sgstAmount: halfTax,
    igstAmount,
    cessAmount: 0,
    lineTotal: round2(taxableAmount + taxAmount),
    hsnOrSac: safe.hsnOrSac,
    unit: safe.unit,
  };
}

export function aggregateTaxTotals(lines: GstTaxLineComputation[]): GstTaxBreakdown {
  return lines.reduce<GstTaxBreakdown>(
    (acc, line) => ({
      taxableAmount: round2(acc.taxableAmount + line.taxableAmount),
      cgstAmount: round2(acc.cgstAmount + line.cgstAmount),
      sgstAmount: round2(acc.sgstAmount + line.sgstAmount),
      igstAmount: round2(acc.igstAmount + line.igstAmount),
      cessAmount: round2(acc.cessAmount + line.cessAmount),
      totalAmount: round2(acc.totalAmount + line.lineTotal),
    }),
    {
      taxableAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      cessAmount: 0,
      totalAmount: 0,
    },
  );
}

export function computeTotals(
  lines: GstDocumentLineInput[],
  isInterstate = false,
): GstServiceResult<{ lines: GstTaxLineComputation[]; totals: GstTaxBreakdown }> {
  if (!Array.isArray(lines) || lines.length === 0) {
    return { ok: false, error: "At least one GST line is required" };
  }

  const computedLines = lines.map((line, index) => computeLineTax(line, isInterstate, index + 1));
  const totals = aggregateTaxTotals(computedLines);

  console.info("[GST TAX] Computed GST totals", {
    lineCount: computedLines.length,
    isInterstate,
    totalAmount: totals.totalAmount,
  });

  return {
    ok: true,
    data: {
      lines: computedLines,
      totals,
    },
  };
}
