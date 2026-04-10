import { prisma } from "../../../../services/db/prisma";
import {
  CANCELLATION_ALLOWED_STATUS_TRANSITIONS,
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
  const eligibilityCheck = evaluateCancellationEligibility({
    fulfillmentStatus: shipmentStatus,
  });
  const nextTransitions = CANCELLATION_ALLOWED_STATUS_TRANSITIONS[request.status] || [];

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>Cancellation Request {request.id}</h1>

      <section>
        <h3>Request Summary</h3>
        <p>Status: {request.status}</p>
        <p>Allowed Next Statuses: {nextTransitions.length ? nextTransitions.join(", ") : "None (terminal)"}</p>
        <p>Requested At: {request.requestedAt.toISOString()}</p>
        <p>Last Updated: {request.updatedAt.toISOString()}</p>
        <p>Request Type: {request.requestType}</p>
        <p>Reason: {request.reason || "-"}</p>
        <p>Customer Note: {request.customerNote || "-"}</p>
        <p>Admin Note: {request.adminNote || "-"}</p>
      </section>

      <section>
        <h3>Customer Summary</h3>
        <p>Name: {request.customerNameSnapshot || "-"}</p>
        <p>Phone: {request.customerPhoneSnapshot || "-"}</p>
        <p>Email: {request.customerEmailSnapshot || "-"}</p>
      </section>

      <section>
        <h3>Order Summary</h3>
        <p>Order Number: {request.orderNumber}</p>
        <p>Order Amount: {request.orderAmountSnapshot || "-"}</p>
        <p>Delivery Date: {request.deliveryDateSnapshot?.toISOString() || "-"}</p>
        <p>Fulfillment / Shipment Indicator: {shipmentStatus}</p>
        <p>Eligibility Check: {eligibilityCheck.eligible ? "ELIGIBLE" : "BLOCKED"}</p>
        <p>Eligibility Reason: {eligibilityCheck.reason}</p>
      </section>

      <section>
        <h3>Payment / Refund Tracking</h3>
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
