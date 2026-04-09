import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../services/db/prisma";
import { verifyRazorpayWebhookSignature } from "../../../../services/exchange/razorpay";

function mapPaymentStatus(event: string) {
  if (event === "payment_link.paid") return "PAID";
  if (event === "payment_link.expired") return "EXPIRED";
  if (event === "payment.failed") return "FAILED";
  if (event === "payment_link.cancelled") return "CANCELLED";
  return "PENDING";
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = (JSON.parse(rawBody || "{}") || {}) as Record<string, unknown>;
  const event = String(payload.event || "");
  const payloadObj = payload["payload"] as Record<string, unknown> | undefined;
  const paymentLinkPayload = payloadObj?.["payment_link"] as { entity?: Record<string, unknown> } | undefined;
  const paymentPayload = payloadObj?.["payment"] as { entity?: Record<string, unknown> } | undefined;
  const paymentEntity = paymentLinkPayload?.entity || paymentPayload?.entity || {};
  const paymentLinkId = String(paymentEntity["id"] || "").trim();
  const paymentId = String(paymentPayload?.entity?.["id"] || "").trim() || null;

  if (!paymentLinkId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const status = mapPaymentStatus(event);

  const payment = await prisma.requestPayment.findFirst({
    where: { paymentLinkId },
    include: { request: true },
  });

  if (!payment) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  await prisma.requestPayment.update({
    where: { id: payment.id },
    data: {
      status: status as never,
      paymentId,
      paidAt: status === "PAID" ? new Date() : payment.paidAt,
    },
  });

  if (status === "PAID") {
    await prisma.orderActionRequest.update({
      where: { id: payment.requestId },
      data: {
        status: "PAYMENT_RECEIVED",
      },
    });

    await prisma.shipmentTracking.upsert({
      where: {
        requestId_direction: {
          requestId: payment.requestId,
          direction: "REVERSE_PICKUP",
        },
      },
      create: {
        requestId: payment.requestId,
        direction: "REVERSE_PICKUP",
        status: "PENDING",
      },
      update: {
        status: "PENDING",
      },
    });
  }

  return NextResponse.json({ ok: true });
}
