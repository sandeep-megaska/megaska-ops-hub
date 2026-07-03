import { prisma } from "../../../../services/db/prisma";
import {
  CANCELLATION_ALLOWED_STATUS_TRANSITIONS,
  deriveCancellationOutcome,
  evaluateCancellationEligibility,
} from "../../../../services/exchange/cancellation";
import CancellationLifecycleControls from "./CancellationLifecycleControls";

export const dynamic = "force-dynamic";

export default async function AdminCancellationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await prisma.orderActionRequest.findFirst({
    where: { id, requestType: "CANCELLATION" },
    include: {
      payments: { orderBy: { createdAt: "desc" } },
      shipments: true,
    },
  });

  if (!request) {
    return <main style={{ padding: 24 }}>Cancellation request not found.</main>;
  }

  const shipmentStatus = request.shipments[0]?.status || "NOT_STARTED";
  const refundRequests = await (prisma as any).refundRequest.findMany({
    where: { orderActionRequestId: request.id },
    orderBy: { updatedAt: "desc" },
  });
  const eligibilityCheck = evaluateCancellationEligibility({
    fulfillmentStatus: shipmentStatus,
  });
  const nextTransitions = CANCELLATION_ALLOWED_STATUS_TRANSITIONS[request.status] || [];
  const outcome = deriveCancellationOutcome({
    cancellationStatus: request.status,
    orderAmountSnapshot: request.orderAmountSnapshot,
    refundRequests,
  });

  return (
    <main className="mk-page">
      <div className="mk-page-header">
        <div>
          <h1 className="mk-page-title">Cancellation Request {request.id}</h1>
          <p className="mk-page-subtitle">Lifecycle, refund outcome, and next action visibility for ops.</p>
        </div>
      </div>

      <section className="mk-card">
        <h2 className="mk-section-title">Cancellation Outcome</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="mk-list-subtitle">Current cancellation status</p>
            <p className="mk-list-title">{outcome.cancellationStatus}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="mk-list-subtitle">Refund requirement</p>
            <p className="mk-list-title">{outcome.refundRequirementLabel}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="mk-list-subtitle">Refund method</p>
            <p className="mk-list-title">{outcome.refundMethodLabel}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="mk-list-subtitle">Refund request</p>
            <p className="mk-list-title">
              {outcome.refundRequest
                ? `${outcome.refundRequest.id} / ${outcome.refundRequest.status}`
                : "Not linked / not available"}
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
            <p className="mk-list-subtitle">Customer-facing explanation</p>
            <p className="text-sm font-medium text-slate-900">{outcome.customerExplanation}</p>
          </div>
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
            <p className="mk-list-subtitle">Ops next step</p>
            <p className="text-sm font-medium text-slate-900">{outcome.opsNextStep}</p>
          </div>
        </div>
      </section>

      <section className="mk-card">
        <h2 className="mk-section-title">Request Summary</h2>
        <p className="mk-list-subtitle">Allowed Next Statuses: {nextTransitions.length ? nextTransitions.join(", ") : "None (terminal)"}</p>
        <p className="mk-list-subtitle">Requested At: {request.requestedAt.toISOString()}</p>
        <p className="mk-list-subtitle">Last Updated: {request.updatedAt.toISOString()}</p>
        <p className="mk-list-subtitle">Request Type: {request.requestType}</p>
        <p className="mk-list-subtitle">Reason: {request.reason || "-"}</p>
        <p className="mk-list-subtitle">Customer Note: {request.customerNote || "-"}</p>
        <p className="mk-list-subtitle">Admin Note: {request.adminNote || "-"}</p>
      </section>

      <section className="mk-grid-4">
        <div className="mk-card mk-stat-card"><p className="mk-stat-label">Customer</p><p className="mk-stat-value text-base">{request.customerNameSnapshot || "-"}</p><p className="mk-list-subtitle">{request.customerPhoneSnapshot || "-"}</p><p className="mk-list-subtitle">{request.customerEmailSnapshot || "-"}</p></div>
        <div className="mk-card mk-stat-card"><p className="mk-stat-label">Order</p><p className="mk-stat-value text-base">{request.orderNumber}</p><p className="mk-list-subtitle">Amount: {request.orderAmountSnapshot || "-"}</p></div>
        <div className="mk-card mk-stat-card"><p className="mk-stat-label">Shipment</p><p className="mk-stat-value text-base">{shipmentStatus}</p><p className="mk-list-subtitle">Delivery: {request.deliveryDateSnapshot?.toISOString() || "-"}</p></div>
        <div className="mk-card mk-stat-card"><p className="mk-stat-label">Eligibility</p><p className="mk-stat-value text-base">{eligibilityCheck.eligible ? "ELIGIBLE" : "BLOCKED"}</p><p className="mk-list-subtitle">{eligibilityCheck.reason}</p></div>
      </section>

      <section className="mk-card">
        <h2 className="mk-section-title">Payment / Refund Tracking</h2>
        {request.payments.length === 0 ? <p>No payment records.</p> : null}
        {request.payments.map((payment) => (
          <article key={payment.id} style={{ border: "1px solid #ddd", padding: 12, marginTop: 8 }}>
            <p>Purpose: {payment.purpose}</p>
            <p>Status: {payment.status}</p>
            <p>Amount: {payment.amount} {payment.currency}</p>
            <p>Provider: {payment.provider}</p>
            <p>Reference: {payment.providerReferenceId || "-"}</p>
          </article>
        ))}
        <div className="mt-4">
          <h3 className="text-base font-semibold text-slate-900">Linked Refund Requests</h3>
          {refundRequests.length === 0 ? <p className="mk-list-subtitle">No linked refund requests.</p> : null}
          {refundRequests.map((refund: any) => (
            <article key={refund.id} className="mt-2 rounded-lg border border-slate-200 p-3">
              <p className="mk-list-subtitle">ID: {refund.id}</p>
              <p className="mk-list-subtitle">Status: {refund.status}</p>
              <p className="mk-list-subtitle">Method: {refund.walletTransactionId ? "STORE_CREDIT" : refund.method}</p>
              <p className="mk-list-subtitle">Amount: {refund.amount} {refund.currency}</p>
            </article>
          ))}
        </div>
      </section>

      <CancellationLifecycleControls
        requestId={request.id}
        currentStatus={request.status}
        allowedTransitions={nextTransitions}
        currentAdminNote={request.adminNote || ""}
      />
    </main>
  );
}
