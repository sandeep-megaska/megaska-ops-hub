import { prisma } from "../../../../services/db/prisma";

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

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>Exchange Request {request.id}</h1>
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
      </section>
      <section>
        <h3>Item Summary</h3>
        {request.items.map((item) => (
          <article key={item.id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 8 }}>
            <p>{item.productTitle}</p>
            <p>Current Size: {item.currentSize || "-"}</p>
            <p>Requested Size: {item.requestedSize}</p>
            <p>Reason: {request.reason || "-"}</p>
            <p>Stock Review Note: {getStockReviewNote(item.eligibilitySnapshot) || "-"}</p>
          </article>
        ))}
      </section>
      <section>
        <h3>Eligibility</h3>
        <p>Decision: {request.eligibilityDecision || "-"}</p>
        <p>Reason: {request.eligibilityReason || "-"}</p>
      </section>
      <section>
        <h3>Payment</h3>
        {request.payments.map((payment) => (
          <article key={payment.id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 8 }}>
            <p>Status: {payment.status}</p>
            <p>Amount: {payment.amount / 100} INR</p>
            <p>Link: {payment.paymentLinkUrl || "-"}</p>
          </article>
        ))}
      </section>
      <section>
        <h3>Shipments</h3>
        {request.shipments.map((shipment) => (
          <article key={shipment.id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 8 }}>
            <p>Direction: {shipment.direction}</p>
            <p>Status: {shipment.status}</p>
            <p>Carrier: {shipment.carrier || "-"}</p>
            <p>AWB: {shipment.awb || "-"}</p>
            <p>Tracking URL: {shipment.trackingUrl || "-"}</p>
          </article>
        ))}
      </section>
      <section>
        <h3>Admin Note</h3>
        <p>{request.adminNote || "-"}</p>
      </section>
    </main>
  );
}
