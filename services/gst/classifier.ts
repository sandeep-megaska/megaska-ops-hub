import type { GstServiceResult, GstSupplyType } from "./types";

export interface GstClassificationInput {
  customerStateCode?: string | null;
  sellerStateCode?: string | null;
  customerGstin?: string | null;
}

export interface GstClassificationResult {
  supplyType: GstSupplyType;
  isInterstate: boolean;
}

export function classifySupply(
  input: GstClassificationInput,
): GstServiceResult<GstClassificationResult> {
  const isInterstate = Boolean(
    input.customerStateCode &&
      input.sellerStateCode &&
      input.customerStateCode !== input.sellerStateCode,
  );

  return {
    ok: true,
    data: {
      supplyType: input.customerGstin ? "B2B" : "B2C",
      isInterstate,
    },
  };
}
