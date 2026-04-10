import { prisma } from "../../../../services/db/prisma";
import ExchangeLifecycleControls from "./ExchangeLifecycleControls";

export const dynamic = "force-dynamic";

function getStockReviewNote(snapshot: unknown) {
  if (!snapshot || typeof snapshot !== "object") return null;
  const note = (snapshot as { stockReviewMessage?: unknown }).stockReviewMessage;
  const value = typeof note === "string" ? note.trim() : "";
  return value || null;
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

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>Exchange Request {request.id}</h1>

      <section>
        <h3>Request Summary</h3>
        <p>Status: {request.status}</p>
        <p>Requested At: {request.requestedAt.toISOString()}</p>
        <p>Request Type: {request.requestType}</p>
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
            <p>Current Size: {item.currentSize || "-"}</p>
            <p>Requested Size: {item.requestedSize}</p>
            <p>Stock Review Note: {getStockReviewNote(item.eligibilitySnapshot) || "-"}</p>
          </article>
        ))}
      </section>

      <section>
        <h3>Eligibility Summary</h3>
        <p>Decision: {request.eligibilityDecision || "-"}</p>
        <p>Reason: {request.eligibilityReason || "-"}</p>
      </section>

      <section>
        <h3>Reverse Shipment</h3>
        <p>Shipment Status: {reverseShipment?.status || "NOT_STARTED"}</p>
        <p>Carrier: {reverseShipment?.carrier || "-"}</p>
        <p>AWB: {reverseShipment?.awb || "-"}</p>
        <p>Tracking URL: {reverseShipment?.trackingUrl || "-"}</p>
      </section>

      <section>
        <h3>Replacement Shipment</h3>
        <p>Shipment Status: {forwardShipment?.status || "NOT_STARTED"}</p>
        <p>Carrier: {forwardShipment?.carrier || "-"}</p>
        <p>AWB: {forwardShipment?.awb || "-"}</p>
        <p>Tracking URL: {forwardShipment?.trackingUrl || "-"}</p>
      </section>

      <section>
        <h3>Admin Notes</h3>
        <p>{request.adminNote || "-"}</p>
      </section>

      <ExchangeLifecycleControls requestId={request.id} />
    </main>
  );
}
