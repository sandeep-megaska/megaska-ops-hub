export const CANCELLATION_ACTIVE_STATUSES = ["OPEN", "APPROVED"] as const;
export const CANCELLATION_BLOCKING_STATUSES = ["OPEN", "APPROVED", "CLOSED"] as const;

export const CANCELLATION_ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
  OPEN: ["APPROVED", "REJECTED", "CLOSED"],
  APPROVED: ["CLOSED"],
};

export type CancellationRefundRequirement =
  | "REFUND_NOT_REQUIRED"
  | "REFUND_PENDING"
  | "MANUAL_REFUND_PENDING"
  | "REFUND_PROCESSING"
  | "REFUND_COMPLETED"
  | "UNKNOWN_NEEDS_REVIEW";

export type CancellationRefundMethod = "PREPAID" | "COD" | "STORE_CREDIT" | "NO_REFUND" | "UNKNOWN";

export type CancellationRefundRequestSummary = {
  id: string;
  status: string;
  method: string;
  amount: number;
  currency: string;
  walletTransactionId?: string | null;
};

export type CancellationOutcome = {
  cancellationStatus: string;
  refundRequirement: CancellationRefundRequirement;
  refundRequirementLabel: string;
  refundMethod: CancellationRefundMethod;
  refundMethodLabel: string;
  refundRequest: CancellationRefundRequestSummary | null;
  customerExplanation: string;
  opsNextStep: string;
};

function normalize(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

function hasAnyKeyword(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

function normalizeFulfillmentStatus(value: string | null | undefined) {
  const status = normalize(value).replace(/[\s-]+/g, "_");
  if (!status) return null;
  if (status === "unfulfilled") return "UNFULFILLED";
  if (status === "fulfilled") return "FULFILLED";
  if (status === "delivered") return "DELIVERED";
  if (status === "in_transit") return "IN_TRANSIT";
  if (status === "out_for_delivery") return "OUT_FOR_DELIVERY";
  if (status === "partial" || status === "partially_fulfilled") return "PARTIAL";
  if (status === "shipped") return "SHIPPED";
  return null;
}

function hasTimestamp(value: string | null | undefined) {
  const raw = String(value || "").trim();
  if (!raw) return false;
  const parsed = new Date(raw);
  return !Number.isNaN(parsed.getTime());
}

export function evaluateCancellationEligibility(input: {
  fulfillmentStatus?: string | null;
  financialStatus?: string | null;
  orderCancelled?: boolean;
  fulfilledAt?: string | null;
  deliveredAt?: string | null;
}) {
  const fulfillmentStatus = normalizeFulfillmentStatus(input.fulfillmentStatus);
  const financialStatus = normalize(input.financialStatus);
  const fulfilledAtExists = hasTimestamp(input.fulfilledAt);
  const deliveredAtExists = hasTimestamp(input.deliveredAt);

  if (input.orderCancelled || hasAnyKeyword(financialStatus, ["void", "cancel", "refunded"])) {
    return {
      eligible: false,
      reason: "Order is already cancelled.",
    };
  }

  if (fulfilledAtExists || deliveredAtExists) {
    return {
      eligible: false,
      reason: "Cancellation not possible — order already shipped.",
    };
  }

  if (["FULFILLED", "DELIVERED", "IN_TRANSIT", "OUT_FOR_DELIVERY", "PARTIAL", "SHIPPED"].includes(String(fulfillmentStatus || ""))) {
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

function formatRefundRequirement(value: CancellationRefundRequirement) {
  const labels: Record<CancellationRefundRequirement, string> = {
    REFUND_NOT_REQUIRED: "Refund not required",
    REFUND_PENDING: "Refund pending",
    MANUAL_REFUND_PENDING: "Manual refund pending",
    REFUND_PROCESSING: "Refund processing",
    REFUND_COMPLETED: "Refund completed",
    UNKNOWN_NEEDS_REVIEW: "Unknown / needs review",
  };
  return labels[value];
}

function formatRefundMethod(value: CancellationRefundMethod) {
  const labels: Record<CancellationRefundMethod, string> = {
    PREPAID: "PREPAID",
    COD: "COD",
    STORE_CREDIT: "STORE_CREDIT",
    NO_REFUND: "NO_REFUND",
    UNKNOWN: "Unknown / needs review",
  };
  return labels[value];
}

function summarizeRefundRequest(refund: {
  id: string;
  status: string;
  method: string;
  amount: number;
  currency: string;
  walletTransactionId?: string | null;
}): CancellationRefundRequestSummary {
  return {
    id: refund.id,
    status: refund.status,
    method: refund.method,
    amount: refund.amount,
    currency: refund.currency,
    walletTransactionId: refund.walletTransactionId || null,
  };
}

export function deriveCancellationOutcome(input: {
  cancellationStatus: string | null | undefined;
  orderAmountSnapshot?: string | null;
  refundRequests?: Array<{
    id: string;
    status: string;
    method: string;
    amount: number;
    currency: string;
    walletTransactionId?: string | null;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
  }> | null;
}): CancellationOutcome {
  const cancellationStatus = String(input.cancellationStatus || "UNKNOWN").trim().toUpperCase();
  const refundRequests = [...(input.refundRequests || [])].sort((a, b) => {
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    return bTime - aTime;
  });
  const refund = refundRequests[0] || null;
  const hasPositiveAmount = Number(input.orderAmountSnapshot || 0) > 0;

  let refundRequirement: CancellationRefundRequirement = "UNKNOWN_NEEDS_REVIEW";
  let refundMethod: CancellationRefundMethod = "UNKNOWN";
  let customerExplanation = "We are reviewing the cancellation and refund outcome.";
  let opsNextStep = "Review order payment data and linked refund records before closing.";

  if (cancellationStatus === "OPEN") {
    refundRequirement = "UNKNOWN_NEEDS_REVIEW";
    customerExplanation = "We received your cancellation request.";
    opsNextStep = "Review eligibility and approve or reject the request.";
  } else if (cancellationStatus === "REJECTED") {
    refundRequirement = "REFUND_NOT_REQUIRED";
    refundMethod = "NO_REFUND";
    customerExplanation = "Cancellation request was rejected.";
    opsNextStep = "No refund action is required unless an exception is raised.";
  } else if (refund) {
    const status = String(refund.status || "").trim().toUpperCase();
    const method = String(refund.method || "").trim().toUpperCase();
    refundMethod = refund.walletTransactionId ? "STORE_CREDIT" : method === "NO_REFUND" ? "NO_REFUND" : method === "COD" ? "COD" : method === "PREPAID" ? "PREPAID" : "UNKNOWN";

    if (status === "NOT_REQUIRED" || method === "NO_REFUND") {
      refundRequirement = "REFUND_NOT_REQUIRED";
      refundMethod = "NO_REFUND";
      customerExplanation = "Cancellation approved. No refund is required for this order.";
      opsNextStep = cancellationStatus === "CLOSED" ? "Cancellation is closed; no refund action required." : "Close the cancellation when operational checks are complete.";
    } else if (status === "PAID") {
      refundRequirement = "REFUND_COMPLETED";
      customerExplanation = "Cancellation process completed.";
      opsNextStep = cancellationStatus === "CLOSED" ? "No further action required." : "Close the cancellation request.";
    } else if (["APPROVED", "PAYOUT_PENDING"].includes(status)) {
      refundRequirement = "REFUND_PROCESSING";
      customerExplanation = "Cancellation approved. Refund is being processed.";
      opsNextStep = "Complete payout/refund processing, then mark the refund paid.";
    } else if (["MANUAL_PENDING", "DETAILS_PENDING", "DETAILS_SUBMITTED", "REVIEW_PENDING"].includes(status)) {
      refundRequirement = method === "COD" ? "MANUAL_REFUND_PENDING" : "REFUND_PENDING";
      customerExplanation = "Cancellation approved. Refund is being processed.";
      opsNextStep = method === "COD" ? "Collect/verify customer payout details and process the manual COD refund." : "Review and advance the refund request.";
    } else if (status === "PENDING") {
      refundRequirement = "REFUND_PENDING";
      customerExplanation = "Cancellation approved. Refund is being processed.";
      opsNextStep = "Review and advance the refund request.";
    } else if (["FAILED", "REJECTED", "CANCELLED"].includes(status)) {
      refundRequirement = "UNKNOWN_NEEDS_REVIEW";
      customerExplanation = "We are reviewing the cancellation and refund outcome.";
      opsNextStep = "Refund request needs manual review before customer communication or closure.";
    }
  } else if (cancellationStatus === "APPROVED" || cancellationStatus === "CLOSED") {
    if (!hasPositiveAmount) {
      refundRequirement = "REFUND_NOT_REQUIRED";
      refundMethod = "NO_REFUND";
      customerExplanation = "Cancellation approved. No refund is required for this order.";
      opsNextStep = cancellationStatus === "CLOSED" ? "No further action required." : "Close the cancellation when operational checks are complete.";
    } else {
      refundRequirement = "UNKNOWN_NEEDS_REVIEW";
      customerExplanation = cancellationStatus === "CLOSED" ? "Cancellation process completed." : "Cancellation approved. Refund outcome is under review.";
      opsNextStep = "No linked refund request was found; verify whether refund is required before closing.";
    }
  } else if (cancellationStatus === "CLOSED") {
    customerExplanation = "Cancellation process completed.";
  }

  return {
    cancellationStatus,
    refundRequirement,
    refundRequirementLabel: formatRefundRequirement(refundRequirement),
    refundMethod,
    refundMethodLabel: formatRefundMethod(refundMethod),
    refundRequest: refund ? summarizeRefundRequest(refund) : null,
    customerExplanation,
    opsNextStep,
  };
}
