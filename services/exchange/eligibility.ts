import { CLEARANCE_KEYWORDS, EXCLUDED_CATEGORY_KEYWORDS } from "./constants";

type EligibilityInput = {
  requestedSize: string;
  currentSize?: string | null;
  productTitle?: string | null;
  variantTitle?: string | null;
  reason?: string | null;
  deliveredAt?: string | null;
};

export type EligibilityDecision = "ELIGIBLE" | "REJECTED" | "REVIEW_REQUIRED";

export function evaluateExchangeEligibility(input: EligibilityInput) {
  const currentSize = String(input.currentSize || "").trim().toLowerCase();
  const requestedSize = String(input.requestedSize || "").trim().toLowerCase();
  const productTitle = String(input.productTitle || "").toLowerCase();
  const variantTitle = String(input.variantTitle || "").toLowerCase();
  const reason = String(input.reason || "").trim();
  const combinedText = `${productTitle} ${variantTitle}`;

  if (!requestedSize) {
    return { decision: "REJECTED" as const, reason: "Requested size is required", blocked: true };
  }

  if (currentSize && currentSize === requestedSize) {
    return {
      decision: "REJECTED" as const,
      reason: "Current size and requested size are identical",
      blocked: true,
    };
  }

  const isExcludedCategory = EXCLUDED_CATEGORY_KEYWORDS.some((keyword) => combinedText.includes(keyword));
  if (isExcludedCategory) {
    return { decision: "REJECTED" as const, reason: "Product category is excluded from exchange", blocked: true };
  }

  const isClearance = CLEARANCE_KEYWORDS.some((keyword) => combinedText.includes(keyword));
  if (isClearance) {
    return { decision: "REJECTED" as const, reason: "Clearance items are not exchangeable", blocked: true };
  }

  if (!reason) {
    return {
      decision: "REVIEW_REQUIRED" as const,
      reason: "Reason missing; admin review required",
      blocked: false,
    };
  }

  const deliveredAt = input.deliveredAt ? new Date(input.deliveredAt) : null;
  if (deliveredAt && !Number.isNaN(deliveredAt.getTime())) {
    const elapsedMs = Date.now() - deliveredAt.getTime();
    const days = elapsedMs / (1000 * 60 * 60 * 24);
    if (days > 2) {
      return {
        decision: "REJECTED" as const,
        reason: "Request is beyond the 2-day exchange window",
        blocked: true,
      };
    }
  } else {
    return {
      decision: "REVIEW_REQUIRED" as const,
      reason: "Delivery date missing; admin review required",
      blocked: false,
    };
  }

  return { decision: "ELIGIBLE" as const, reason: "Eligible for exchange", blocked: false };
}
