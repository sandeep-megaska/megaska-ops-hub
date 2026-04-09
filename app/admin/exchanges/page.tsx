import Link from "next/link";
import { prisma } from "../../../services/db/prisma";

export const dynamic = "force-dynamic";

export default async function AdminExchangesPage() {
  const requests = await prisma.orderActionRequest.findMany({
    where: { requestType: "EXCHANGE" },
    include: {
      items: { take: 1 },
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
      shipments: true,
    },
    orderBy: { requestedAt: "desc" },
    take: 100,
  });

  return (
    <main style={{ padding: 24 }}>
      <h1>Exchange Requests</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {[
              "Request",
              "Date",
              "Customer",
              "Phone",
              "Order",
              "Item",
              "Requested Size",
              "Request Status",
              "Payment",
              "Reverse Pickup",
            ].map((head) => (
              <th key={head} style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {requests.map((item) => {
            const firstItem = item.items[0];
            const reverse = item.shipments.find((shipment) => shipment.direction === "REVERSE_PICKUP");
            return (
              <tr key={item.id}>
                <td style={{ padding: 8 }}>
                  <Link href={`/admin/exchanges/${item.id}`}>{item.id.slice(0, 8)}</Link>
                </td>
                <td style={{ padding: 8 }}>{item.requestedAt.toISOString().slice(0, 10)}</td>
                <td style={{ padding: 8 }}>{item.customerNameSnapshot || "-"}</td>
                <td style={{ padding: 8 }}>{item.customerPhoneSnapshot || "-"}</td>
                <td style={{ padding: 8 }}>{item.orderNumber}</td>
                <td style={{ padding: 8 }}>{firstItem?.productTitle || "-"}</td>
                <td style={{ padding: 8 }}>{firstItem?.requestedSize || "-"}</td>
                <td style={{ padding: 8 }}>{item.status}</td>
                <td style={{ padding: 8 }}>{item.payments[0]?.status || "NOT_CREATED"}</td>
                <td style={{ padding: 8 }}>{reverse?.status || "NOT_STARTED"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
