import Link from "next/link";
import { prisma } from "../../../services/db/prisma";

type Props = {
  searchParams: Promise<{
    status?: string;
    orderNumber?: string;
    customerPhone?: string;
    customerName?: string;
    startDate?: string;
    endDate?: string;
  }>;
};

const STATUS_OPTIONS = ["OPEN", "APPROVED", "REJECTED", "CLOSED"];

export default async function AdminCancellationsPage({ searchParams }: Props) {
  const filters = await searchParams;

  const requests = await prisma.orderActionRequest.findMany({
    where: {
      requestType: "CANCELLATION",
      ...(filters.status ? { status: filters.status as never } : {}),
      ...(filters.orderNumber
        ? { orderNumber: { contains: filters.orderNumber.trim(), mode: "insensitive" } }
        : {}),
      ...(filters.customerPhone
        ? { customerPhoneSnapshot: { contains: filters.customerPhone.trim(), mode: "insensitive" } }
        : {}),
      ...(filters.customerName
        ? { customerNameSnapshot: { contains: filters.customerName.trim(), mode: "insensitive" } }
        : {}),
      ...((filters.startDate || filters.endDate)
        ? {
            requestedAt: {
              ...(filters.startDate ? { gte: new Date(`${filters.startDate}T00:00:00.000Z`) } : {}),
              ...(filters.endDate ? { lte: new Date(`${filters.endDate}T23:59:59.999Z`) } : {}),
            },
          }
        : {}),
    },
    include: {
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
      shipments: true,
    },
    orderBy: { requestedAt: "desc" },
    take: 300,
  });

  return (
    <main style={{ padding: 24, display: "grid", gap: 12 }}>
      <h1>Cancellation Requests</h1>
      <form style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(120px, 1fr))", gap: 8 }}>
        <select name="status" defaultValue={filters.status || ""}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <input name="orderNumber" defaultValue={filters.orderNumber || ""} placeholder="Order number" />
        <input name="customerPhone" defaultValue={filters.customerPhone || ""} placeholder="Phone" />
        <input name="customerName" defaultValue={filters.customerName || ""} placeholder="Customer name" />
        <input type="date" name="startDate" defaultValue={filters.startDate || ""} />
        <input type="date" name="endDate" defaultValue={filters.endDate || ""} />
        <button type="submit">Apply Filters</button>
      </form>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Request", "Date", "Order", "Customer", "Phone", "Type", "Status", "Payment", "Fulfillment", "Action"].map((head) => (
              <th key={head} style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {requests.map((item) => {
            const fulfillmentIndicator = item.shipments[0]?.status || "NOT_STARTED";
            return (
              <tr key={item.id}>
                <td style={{ padding: 8 }}>{item.id.slice(0, 8)}</td>
                <td style={{ padding: 8 }}>{item.requestedAt.toISOString().slice(0, 10)}</td>
                <td style={{ padding: 8 }}>{item.orderNumber}</td>
                <td style={{ padding: 8 }}>{item.customerNameSnapshot || "-"}</td>
                <td style={{ padding: 8 }}>{item.customerPhoneSnapshot || "-"}</td>
                <td style={{ padding: 8 }}>{item.requestType}</td>
                <td style={{ padding: 8 }}>{item.status}</td>
                <td style={{ padding: 8 }}>{item.payments[0]?.status || "NOT_CREATED"}</td>
                <td style={{ padding: 8 }}>{fulfillmentIndicator}</td>
                <td style={{ padding: 8 }}>
                  <Link href={`/admin/cancellations/${item.id}`}>Open</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
