import { allowedStatusTransitions } from "../../../../services/exchange/lifecycle";
import { prisma } from "../../../../services/db/prisma";
import ExchangeLifecycleControls from "./ExchangeLifecycleControls";

export const dynamic = "force-dynamic";

function getStockReviewNote(snapshot: unknown) {
  if (!snapshot || typeof snapshot !== "object") return null;
  const note = (snapshot as { stockReviewMessage?: unknown }).stockReviewMessage;
  const value = typeof note === "string" ? note.trim() : "";
  return value || null;
}

function getOptionalDateValue(record: unknown, key: string) {
  if (!record || typeof record !== "object") return null;
  const value = (record as Record<string, unknown>)[key];
  return value instanceof Date ? value.toISOString() : null;
}

function getOptionalStringValue(record: unknown, key: string) {
  if (!record || typeof record !== "object") return null;
  const value = (record as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value : null;
}

export default async function AdminExchangeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await prisma.orderActionRequest.findFirst({
    where: { id, requestType: "EXCHANGE" },
    include: {
      items: true,
      payments: { orderBy: { createdAt: "desc" } },
      shipments: true,
    },
  });

  if (!request) {
    return <main style={{ padding: 24 }}>Exchange request not found.</main>;
  }

  const reverseShipment = request.shipments.find((shipment) => shipment.direction === "REVERSE_PICKUP");
  const forwardShipment = request.shipments.find((shipment) => shipment.direction === "FORWARD_REPLACEMENT");
  const nextTransitions = allowedStatusTransitions[request.status] || [];

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>Exchange Request {request.id}</h1>

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
        <h3>Order / Item Summary</h3>
        <p>Order Number: {request.orderNumber}</p>
        <p>Order Amount: {request.orderAmountSnapshot || "-"}</p>
        <p>Delivery Date: {request.deliveryDateSnapshot?.toISOString() || "-"}</p>
        {request.items.map((item) => (
          <article key={item.id} style={{ border: "1px solid #ddd", padding: 12, marginTop: 8 }}>
            <p>Product: {item.productTitle}</p>
            <p>Variant: {item.variantTitle || "-"}</p>
            <p>Current Size: {item.currentSize || "-"}</p>
            <p>Requested Size: {item.requestedSize}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Stock Review Note: {getStockReviewNote(item.eligibilitySnapshot) || "-"}</p>
          </article>
        ))}
      </section>

      <section>
        <h3>Payments</h3>
        {request.payments.length === 0 ? <p>No payment records.</p> : null}
        {request.payments.map((payment) => (
          <article key={payment.id} style={{ border: "1px solid #ddd", padding: 12, marginTop: 8 }}>
            <p>Purpose: {payment.purpose}</p>
            <p>Status: {payment.status}</p>
            <p>Amount: {payment.amount} {payment.currency}</p>
            <p>Link: {payment.paymentLinkUrl || "-"}</p>
          </article>
        ))}
      </section>

      <section>
        <h3>Reverse Shipment</h3>
        <p>Shipment Status: {reverseShipment?.status || "NOT_STARTED"}</p>
        <p>Carrier: {reverseShipment?.carrier || "-"}</p>
        <p>AWB: {reverseShipment?.awb || "-"}</p>
        <p>Tracking URL: {reverseShipment?.trackingUrl || "-"}</p>
        <p>Pickup Date: {getOptionalDateValue(reverseShipment, "pickupAt") || "-"}</p>
        <p>Delivered Date: {getOptionalDateValue(reverseShipment, "deliveredAt") || "-"}</p>
        <p>Remarks: {getOptionalStringValue(reverseShipment, "remarks") || "-"}</p>
      </section>

      <section>
        <h3>Replacement Shipment</h3>
        <p>Shipment Status: {forwardShipment?.status || "NOT_STARTED"}</p>
        <p>Carrier: {forwardShipment?.carrier || "-"}</p>
        <p>AWB: {forwardShipment?.awb || "-"}</p>
        <p>Tracking URL: {forwardShipment?.trackingUrl || "-"}</p>
        <p>Shipped Date: {getOptionalDateValue(forwardShipment, "shippedAt") || "-"}</p>
        <p>Delivered Date: {getOptionalDateValue(forwardShipment, "deliveredAt") || "-"}</p>
        <p>Remarks: {getOptionalStringValue(forwardShipment, "remarks") || "-"}</p>
      </section>

      <ExchangeLifecycleControls requestId={request.id} currentStatus={request.status} allowedTransitions={nextTransitions} currentAdminNote={request.adminNote || ""} />
    </main>
  );
}
