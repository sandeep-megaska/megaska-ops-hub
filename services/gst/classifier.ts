import { GST_DEFAULT_SUPPLY_TYPE } from "./constants";
import type { GstServiceResult, GstSupplyType } from "./types";

export interface GstClassificationInput {
  sellerStateCode?: string | null;
  buyerGstin?: string | null;
  shippingStateCode?: string | null;
  billingStateCode?: string | null;
  explicitSupplyType?: GstSupplyType;
}

export interface GstClassificationResult {
  supplyType: GstSupplyType;
  placeOfSupplyStateCode: string;
  isInterstate: boolean;
  customerType: "B2B" | "B2C";
}

export function normalizeStateCode(value: string | null | undefined): string | null {
  const cleaned = String(value ?? "").trim();
  return cleaned || null;
}

export function determineSupplyType(input: GstClassificationInput): GstSupplyType {
  if (input.explicitSupplyType) {
    return input.explicitSupplyType;
  }

  return input.buyerGstin ? "B2B" : GST_DEFAULT_SUPPLY_TYPE;
}

export function determinePlaceOfSupply(input: GstClassificationInput): string | null {
  return normalizeStateCode(input.shippingStateCode) || normalizeStateCode(input.billingStateCode);
}

export function classifySupply(
  input: GstClassificationInput,
): GstServiceResult<GstClassificationResult> {
  const sellerStateCode = normalizeStateCode(input.sellerStateCode);
  const placeOfSupplyStateCode = determinePlaceOfSupply(input);

  if (!sellerStateCode) {
    return { ok: false, error: "sellerStateCode is required for GST classification" };
  }
  if (!placeOfSupplyStateCode) {
    return { ok: false, error: "At least one of shippingStateCode or billingStateCode is required" };
  }

  const supplyType = determineSupplyType(input);
  const isInterstate = sellerStateCode !== placeOfSupplyStateCode;

  return {
    ok: true,
    data: {
      supplyType,
      placeOfSupplyStateCode,
      isInterstate,
      customerType: input.buyerGstin ? "B2B" : GST_DEFAULT_SUPPLY_TYPE,
    },
  };
}
