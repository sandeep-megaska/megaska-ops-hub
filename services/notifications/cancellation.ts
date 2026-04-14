import { sendAdminAlert } from "./resend";

type CancellationNotifyPayload = {
  requestId: string;
  orderNumber: string;
  status: string;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  reason?: string | null;
  adminNote?: string | null;
};

function buildBody(payload: CancellationNotifyPayload) {
  const appBaseUrl = String(process.env.APP_BASE_URL || "").trim().replace(/\/$/, "");
  const adminUrl = appBaseUrl ? `${appBaseUrl}/admin/cancellations/${encodeURIComponent(payload.requestId)}` : "-";

  return [
    `Request ID: ${payload.requestId}`,
    `Order Number: ${payload.orderNumber}`,
    `Current Status: ${payload.status}`,
    `Customer Name: ${payload.customerName || "-"}`,
    `Customer Phone: ${payload.customerPhone || "-"}`,
    `Customer Email: ${payload.customerEmail || "-"}`,
    `Reason: ${payload.reason || "-"}`,
    `Admin Note: ${payload.adminNote || "-"}`,
    `Admin URL: ${adminUrl}`,
  ].join("\n");
}

export async function sendCancellationTeamAlert(
  eventName: string,
  subject: string,
  payload: CancellationNotifyPayload
) {
  const result = await sendAdminAlert(subject, buildBody(payload));

  if (result.skipped) return;

  if (result.success) {
    console.info("[CANCELLATION NOTIFY] Email sent", {
      requestId: payload.requestId,
      eventName,
      providerMessageId: result.messageId || null,
    });
    return;
  }

  console.error("[CANCELLATION NOTIFY] Email failed", {
    requestId: payload.requestId,
    eventName,
  });
}

export async function sendCancellationRequestCreatedEmail(payload: CancellationNotifyPayload) {
  await sendCancellationTeamAlert(
    "REQUEST_CREATED",
    `New cancellation request: #${payload.orderNumber}`,
    payload
  );
}

export async function sendCancellationStatusChangedEmail(payload: CancellationNotifyPayload) {
  const eventByStatus: Record<string, { event: string; subject: string } | undefined> = {
    APPROVED: { event: "APPROVED", subject: `Cancellation approved: #${payload.orderNumber}` },
    REJECTED: { event: "REJECTED", subject: `Cancellation rejected: #${payload.orderNumber}` },
    CLOSED: { event: "CLOSED", subject: `Cancellation closed: #${payload.orderNumber}` },
  };

  const config = eventByStatus[payload.status];
  if (!config) return;

  await sendCancellationTeamAlert(config.event, config.subject, payload);
}
