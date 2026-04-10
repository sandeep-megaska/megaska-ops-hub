import { prisma } from "../../../../services/db/prisma";
import { getOrCreateWalletAccount, listWalletTransactions } from "../../../../services/wallet";
import WalletOpsControls from "./WalletOpsControls";

export const dynamic = "force-dynamic";

function displayName(customer: { firstName: string | null; lastName: string | null; fullName: string | null }) {
  const joined = [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim();
  return joined || customer.fullName || "-";
}

export default async function AdminWalletDetailPage({ params }: { params: Promise<{ customerProfileId: string }> }) {
  const { customerProfileId } = await params;

  const customer = await prisma.customerProfile.findUnique({
    where: { id: customerProfileId },
    select: {
      id: true,
      phoneE164: true,
      email: true,
      firstName: true,
      lastName: true,
      fullName: true,
    },
  });

  if (!customer) {
    return <main style={{ padding: 24 }}>Customer not found.</main>;
  }

  const wallet = await getOrCreateWalletAccount(customer.id, "INR");
  const transactions = await listWalletTransactions(customer.id, "INR", 200);

  return (
    <main style={{ padding: 24, display: "grid", gap: 14 }}>
      <h1>Wallet Detail</h1>
      <section>
        <p>Customer: {displayName(customer)}</p>
        <p>Phone: {customer.phoneE164}</p>
        <p>Email: {customer.email || "-"}</p>
        <p>Current Balance: {wallet.currency} {(wallet.currentBalance / 100).toFixed(2)}</p>
      </section>

      <WalletOpsControls customerProfileId={customer.id} />

      <section>
        <h3>Wallet Ledger</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Date", "Direction", "Type", "Amount", "Reason", "Source", "Order", "Created By"].map((head) => (
                <th key={head} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td style={{ padding: 8 }}>{txn.createdAt.toISOString().slice(0, 19).replace("T", " ")}</td>
                <td style={{ padding: 8 }}>{txn.direction}</td>
                <td style={{ padding: 8 }}>{txn.transactionType}</td>
                <td style={{ padding: 8 }}>
                  {txn.currency} {(txn.amount / 100).toFixed(2)}
                </td>
                <td style={{ padding: 8 }}>{txn.reason || txn.adminNote || "-"}</td>
                <td style={{ padding: 8 }}>{txn.sourceType}{txn.sourceReference ? ` (${txn.sourceReference})` : ""}</td>
                <td style={{ padding: 8 }}>{txn.orderNumber || "-"}</td>
                <td style={{ padding: 8 }}>{txn.createdByType}{txn.createdById ? ` (${txn.createdById})` : ""}</td>
              </tr>
            ))}
            {!transactions.length ? (
              <tr>
                <td style={{ padding: 8 }} colSpan={8}>
                  No wallet transactions yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </main>
  );
}
