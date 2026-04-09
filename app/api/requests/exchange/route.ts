import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "../../_lib/cors";
import { prisma } from "../../../../services/db/prisma";
import { getAuthenticatedCustomer } from "../../../../services/exchange/auth";
import { evaluateExchangeEligibility } from "../../../../services/exchange/eligibility";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedCustomer(req);
    if (!session) {
      return withCors(req, NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    }

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const orderNumber = String(body?.orderNumber || "").trim();
    const shopifyOrderId = String(body?.shopifyOrderId || "").trim() || null;
    const productTitle = String(body?.productTitle || "").trim();
    const variantTitle = String(body?.variantTitle || "").trim() || null;
    const requestedSize = String(body?.requestedSize || "").trim();
    const currentSize = String(body?.currentSize || "").trim() || null;
    const reason = String(body?.reason || "").trim();
    const customerNote = String(body?.customerNote || "").trim() || null;
    const deliveredAtRaw = String(body?.deliveredAt || "").trim() || null;
    const quantity = Number(body?.quantity || 1);
    const amountSnapshot = String(body?.orderAmountSnapshot || "").trim() || null;

    if (!orderNumber || !productTitle || !requestedSize) {
      return withCors(req, NextResponse.json({ error: "Missing required fields" }, { status: 400 }));
    }

    const eligibility = evaluateExchangeEligibility({
      requestedSize,
      currentSize,
      productTitle,
      variantTitle,
      reason,
      deliveredAt: deliveredAtRaw,
    });

    const initialStatus =
      eligibility.decision === "REJECTED"
        ? "REJECTED"
        : eligibility.decision === "ELIGIBLE"
          ? "AWAITING_PAYMENT"
          : "OPEN";

    const created = await prisma.orderActionRequest.create({
      data: {
        requestType: "EXCHANGE",
        customerProfileId: session.customer.id,
        shopifyCustomerId: session.customer.shopifyCustomerId || null,
        shopifyOrderId,
        orderNumber,
        status: initialStatus,
        reason,
        customerNote,
        customerNameSnapshot: `${session.customer.firstName || ""} ${session.customer.lastName || ""}`.trim() || session.customer.fullName || null,
        customerPhoneSnapshot: session.customer.phoneE164,
        customerEmailSnapshot: session.customer.email,
        orderAmountSnapshot: amountSnapshot,
        deliveryDateSnapshot: deliveredAtRaw ? new Date(deliveredAtRaw) : null,
        eligibilityDecision: eligibility.decision,
        eligibilityReason: eligibility.reason,
        items: {
          create: {
            shopifyLineItemId: String(body?.shopifyLineItemId || "").trim() || null,
            productTitle,
            variantTitle,
            sku: String(body?.sku || "").trim() || null,
            currentSize,
            requestedSize,
            quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
            isClearance: eligibility.reason.toLowerCase().includes("clearance"),
            isExcludedCategory: eligibility.reason.toLowerCase().includes("category"),
            eligibilitySnapshot: eligibility,
          },
        },
      },
      include: {
        items: true,
        payments: true,
      },
    });

    return withCors(req, NextResponse.json({ request: created }, { status: 201 }));
  } catch (error) {
    return withCors(
      req,
      NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 })
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedCustomer(req);
    if (!session) {
      return withCors(req, NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    }

    const status = req.nextUrl.searchParams.get("status")?.trim() || undefined;

    const requests = await prisma.orderActionRequest.findMany({
      where: {
        customerProfileId: session.customer.id,
        requestType: "EXCHANGE",
        ...(status ? { status: status as never } : {}),
      },
      include: {
        items: true,
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        shipments: true,
      },
      orderBy: { requestedAt: "desc" },
    });

    return withCors(req, NextResponse.json({ requests }));
  } catch (error) {
    return withCors(
      req,
      NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 })
    );
  }
}
