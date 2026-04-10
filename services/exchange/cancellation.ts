export const CANCELLATION_ACTIVE_STATUSES = ["OPEN", "APPROVED"] as const;
export const CANCELLATION_BLOCKING_STATUSES = ["OPEN", "APPROVED", "CLOSED"] as const;

export const CANCELLATION_ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
  OPEN: ["APPROVED", "REJECTED", "CLOSED"],
  APPROVED: ["CLOSED"],
};

function normalize(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

function hasAnyKeyword(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

export function evaluateCancellationEligibility(input: {
  fulfillmentStatus?: string | null;
  financialStatus?: string | null;
  orderCancelled?: boolean;
}) {
  const fulfillmentStatus = normalize(input.fulfillmentStatus);
  const financialStatus = normalize(input.financialStatus);

  if (input.orderCancelled || hasAnyKeyword(financialStatus, ["void", "cancel", "refunded"])) {
    return {
      eligible: false,
      reason: "Order is already cancelled.",
    };
  }

  if (
    hasAnyKeyword(fulfillmentStatus, [
      "fulfilled",
      "delivered",
      "shipped",
      "in transit",
      "in_transit",
      "out for delivery",
      "ready for pickup",
      "label printed",
      "partially fulfilled",
      "partial",
    ])
  ) {
    return {
      eligible: false,
      reason: "Cancellation not possible — order already shipped.",
    };
  }

  return {
    eligible: true,
    reason: "Eligible for cancellation",
  };
}

export function isCancellationStatusBlocking(status: string | null | undefined) {
  const normalized = String(status || "").trim().toUpperCase();
  return CANCELLATION_BLOCKING_STATUSES.includes(normalized as (typeof CANCELLATION_BLOCKING_STATUSES)[number]);
}
