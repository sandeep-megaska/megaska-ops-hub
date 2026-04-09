import { getOpsNotificationConfig, sendEmailWithResend } from "./resend";

type ExchangeEmailPayload = {
  requestId: string;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  orderNumber: string;
  itemTitle: string;
  currentSize?: string | null;
  requestedSize: string;
  reason?: string | null;
  createdAt: string;
  status: string;
};

function escapeHtml(value: string | null | undefined) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendExchangeRequestCreatedEmail(payload: ExchangeEmailPayload) {
  const config = getOpsNotificationConfig();
  if (!config.enabled) return;

  const appBaseUrl = String(process.env.APP_BASE_URL || "").trim().replace(/\/$/, "");
  const adminUrl = appBaseUrl ? `${appBaseUrl}/admin/exchanges/${encodeURIComponent(payload.requestId)}` : null;

  const subject = `New Exchange Request #${payload.requestId}`;
  const createdAtLabel = new Date(payload.createdAt).toISOString();

  const html = `
    <h2>New exchange request created</h2>
    <p><strong>Request ID:</strong> ${escapeHtml(payload.requestId)}</p>
    <p><strong>Status:</strong> ${escapeHtml(payload.status)}</p>
    <p><strong>Created at:</strong> ${escapeHtml(createdAtLabel)}</p>
    <hr />
    <p><strong>Customer name:</strong> ${escapeHtml(payload.customerName || "-")}</p>
    <p><strong>Customer phone:</strong> ${escapeHtml(payload.customerPhone || "-")}</p>
    <p><strong>Customer email:</strong> ${escapeHtml(payload.customerEmail || "-")}</p>
    <hr />
    <p><strong>Order number:</strong> ${escapeHtml(payload.orderNumber)}</p>
    <p><strong>Item title:</strong> ${escapeHtml(payload.itemTitle)}</p>
    <p><strong>Current size:</strong> ${escapeHtml(payload.currentSize || "-")}</p>
    <p><strong>Requested size:</strong> ${escapeHtml(payload.requestedSize)}</p>
    <p><strong>Reason / note:</strong> ${escapeHtml(payload.reason || "-")}</p>
    ${adminUrl ? `<p><strong>Admin URL:</strong> <a href="${escapeHtml(adminUrl)}">${escapeHtml(adminUrl)}</a></p>` : ""}
  `;

  await sendEmailWithResend({
    from: config.from,
    to: config.to,
    cc: config.cc,
    subject,
    html,
  });
}
