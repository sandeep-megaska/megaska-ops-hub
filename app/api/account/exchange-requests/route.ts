import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "../../_lib/cors";
import { prisma } from "../../../../services/db/prisma";
import { ShopResolutionError } from "../../../../services/shopify/shop";
import { getAuthenticatedExchangeCustomer } from "../../../../services/exchange/auth";
import { evaluateExchangeEligibility } from "../../../../services/exchange/eligibility";
import { sendExchangeRequestCreatedEmail } from "../../../../services/notifications/exchange";
import { getMegaskaCustomerDashboardData } from "../../../../services/shopify/dashboard";
import {
  findActiveRequest,
  formatRequestLockReason,
  orderNumberVariants,
} from "../../../../services/exchange/request-interlocks";
import {
  listSameProductReplacementVariants,
  resolveOrderedExchangeLine,
} from "../../../../services/exchange/replacement-variants";

function normalizeOrderNumber(value: string | null | undefined) {
  const trimmed = String(value || "").trim();
  return trimmed.startsWith("#") ? trimmed : trimmed ? `#${trimmed}` : "";
}

function resolveCustomerSnapshots(customer: Record<string, unknown>) {
  const firstName = String(customer.firstName || "").trim();
  const lastName = String(customer.lastName || "").trim();
  const fullName = String(customer.fullName || "").trim();
  const displayName = String(customer.displayName || "").trim();
  const profileName = String(customer.name || "").trim();
  const shopifyName = String(customer.shopifyCustomerName || "").trim();
  const compositeName = `${firstName} ${lastName}`.trim();

  const customerNameSnapshot =
    compositeName ||
    fullName ||
    displayName ||
    profileName ||
    shopifyName ||
    null;

  const customerEmailSnapshot =
    String(customer.email || "").trim() ||
    String(customer.shopifyCustomerEmail || "").trim() ||
    null;

  const customerPhoneSnapshot =
    String(customer.phoneE164 || "").trim() ||
    String(customer.phone || "").trim() ||
    String(customer.shopifyCustomerPhone || "").trim() ||
    null;

  return {
    customerNameSnapshot,
    customerEmailSnapshot,
    customerPhoneSnapshot,
  };
}

async function resolveTrustedFulfillment(input: {
  shopId: string;
  shopDomain: string;
  customerProfileId: string;
  customerShopifyId?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  orderNumber: string;
  shopifyOrderId?: string | null;
}) {
  const targetOrderNumber = normalizeOrderNumber(input.orderNumber);

  const localOrder = await prisma.megaskaOrder.findFirst({
    where: {
      shopId: input.shopId,
      customerProfileId: input.customerProfileId,
      OR: [
        ...(input.shopifyOrderId
          ? [{ shopifyOrderId: input.shopifyOrderId }]
          : []),
        ...(targetOrderNumber ? [{ shopifyOrderName: targetOrderNumber }] : []),
      ],
    },
    select: {
      status: true,
      statusUpdatedAt: true,
      shipments: {
        orderBy: [{ statusUpdatedAt: "desc" }, { updatedAt: "desc" }],
        select: {
          normalizedStatus: true,
          statusUpdatedAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (localOrder) {
    const deliveredShipment = localOrder.shipments.find(
      (shipment) => shipment.normalizedStatus === "DELIVERED",
    );
    if (deliveredShipment) {
      return {
        deliveredAt: (
          deliveredShipment.statusUpdatedAt || deliveredShipment.updatedAt
        ).toISOString(),
        fulfillmentStatus: "delivered",
      };
    }

    if (localOrder.status === "DELIVERED") {
      return {
        deliveredAt: localOrder.statusUpdatedAt?.toISOString() || null,
        fulfillmentStatus: "delivered",
      };
    }

    return {
      deliveredAt: null,
      fulfillmentStatus: localOrder.status.toLowerCase(),
    };
  }

  try {
    const dashboard = await getMegaskaCustomerDashboardData({
      shopDomain: input.shopDomain,
      customerId: input.customerShopifyId,
      email: input.customerEmail,
      phoneE164: input.customerPhone,
    });

    const matchingOrder =
      dashboard?.recentOrders.find((order) => {
        const matchesById = Boolean(
          input.shopifyOrderId && order.shopifyOrderId === input.shopifyOrderId,
        );
        const matchesByName = Boolean(
          targetOrderNumber &&
          normalizeOrderNumber(order.name) === targetOrderNumber,
        );
        return matchesById || matchesByName;
      }) || null;

    if (matchingOrder) {
      const deliveredAt = matchingOrder.deliveredAt || null;
      return {
        deliveredAt,
        fulfillmentStatus: deliveredAt
          ? "delivered"
          : matchingOrder.fulfillmentStatus || null,
      };
    }
  } catch (error) {
    console.warn("[EXCHANGE ELIGIBILITY] Shopify fallback lookup failed", {
      orderNumber: input.orderNumber,
      shopifyOrderId: input.shopifyOrderId || null,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
  }

  return null;
}

export const runtime = "nodejs";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedExchangeCustomer(req);
    if (!auth) {
      return withCors(
        req,
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      );
    }

    const { shop, session } = auth;
    const customer = session.customer;

    const body = (await req.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    const orderNumber = String(body?.orderNumber || "").trim();
    const shopifyOrderId = String(body?.shopifyOrderId || "").trim() || null;
    const productTitle = String(body?.productTitle || "").trim();
    const variantTitle = String(body?.variantTitle || "").trim() || null;
    const requestedSize = String(body?.requestedSize || "").trim();
    const currentSize = String(body?.currentSize || "").trim() || null;
    const reason = String(body?.reason || "").trim();
    const customerNote = String(body?.customerNote || "").trim() || null;
    const fulfillmentStatus =
      String(body?.fulfillmentStatus || "").trim() || null;
    const quantity = Number(body?.quantity || 1);
    const amountSnapshot =
      String(body?.orderAmountSnapshot || "").trim() || null;
    const shopifyLineItemId =
      String(body?.shopifyLineItemId || "").trim() || null;
    const shopifyProductId =
      String(body?.shopifyProductId || body?.productId || "").trim() || null;
    const shopifyVariantId =
      String(body?.shopifyVariantId || body?.variantId || "").trim() || null;
    const requestedVariantId =
      String(body?.requestedVariantId || "").trim() || null;
    const requestedSku = String(body?.requestedSku || "").trim() || null;
    const sku = String(body?.sku || "").trim() || null;
    const preferredReturnMethodRaw = String(body?.preferredReturnMethod || "")
      .trim()
      .toUpperCase();
    const preferredReturnMethod =
      preferredReturnMethodRaw === "SELF_SHIP" ? "SELF_SHIP" : "REVERSE_PICKUP";

    if (!orderNumber || !productTitle || !requestedSize) {
      return withCors(
        req,
        NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        ),
      );
    }

    const orderedLine = await resolveOrderedExchangeLine({
      shopDomain: shop.shopDomain,
      customerShopifyId: customer.shopifyCustomerId,
      customerEmail: customer.email,
      customerPhone: customer.phoneE164,
      orderNumber,
      shopifyOrderId,
      shopifyLineItemId,
      productId: shopifyProductId,
      variantId: shopifyVariantId,
      sku,
      productTitle,
      variantTitle,
      currentSize,
    });

    if (!orderedLine.productId || !orderedLine.variantId) {
      return withCors(
        req,
        NextResponse.json(
          {
            error:
              "Unable to identify the ordered Shopify product and variant.",
          },
          { status: 400 },
        ),
      );
    }

    const replacementOptions = await listSameProductReplacementVariants({
      shopId: shop.id,
      shopDomain: shop.shopDomain,
      productId: orderedLine.productId,
      currentVariantId: orderedLine.variantId,
    });
    const selectedReplacement = replacementOptions.find(
      (option) => option.variantId === requestedVariantId,
    );

    if (!selectedReplacement) {
      return withCors(
        req,
        NextResponse.json(
          {
            error:
              "Please select an available replacement size from the same product.",
          },
          { status: 400 },
        ),
      );
    }

    if (
      selectedReplacement.size.trim().toLowerCase() !==
      requestedSize.trim().toLowerCase()
    ) {
      return withCors(
        req,
        NextResponse.json(
          {
            error:
              "Requested size does not match the selected replacement variant.",
          },
          { status: 400 },
        ),
      );
    }

    const trustedFulfillment = await resolveTrustedFulfillment({
      shopId: shop.id,
      shopDomain: shop.shopDomain,
      customerProfileId: customer.id,
      customerShopifyId: customer.shopifyCustomerId,
      customerEmail: customer.email,
      customerPhone: customer.phoneE164,
      orderNumber,
      shopifyOrderId,
    });

    const resolvedDeliveredAt = trustedFulfillment?.deliveredAt ?? null;
    const resolvedFulfillmentStatus =
      trustedFulfillment?.fulfillmentStatus ?? fulfillmentStatus;

    const eligibility = evaluateExchangeEligibility({
      requestedSize,
      currentSize: orderedLine.currentSize || currentSize,
      productTitle: orderedLine.productTitle || productTitle,
      variantTitle: orderedLine.variantTitle || variantTitle,
      reason,
      deliveredAt: resolvedDeliveredAt,
      fulfillmentStatus: resolvedFulfillmentStatus,
    });

    if (eligibility.blocked) {
      return withCors(
        req,
        NextResponse.json({ error: eligibility.reason }, { status: 400 }),
      );
    }

    const existingRequests = await prisma.orderActionRequest.findMany({
      where: {
        shopId: shop.id,
        customerProfileId: customer.id,
        requestType: { in: ["CANCELLATION", "EXCHANGE", "ISSUE"] },
        orderNumber: { in: orderNumberVariants(orderNumber) },
      },
      orderBy: { requestedAt: "desc" },
      select: { id: true, requestType: true, status: true },
    });
    const activeRequest = findActiveRequest(existingRequests);

    if (activeRequest) {
      const error =
        activeRequest.requestType === "EXCHANGE"
          ? "An exchange request already exists for this order."
          : `Cannot request exchange while ${formatRequestLockReason(activeRequest)?.toLowerCase()}`;

      return withCors(req, NextResponse.json({ error }, { status: 400 }));
    }

    const initialStatus = "OPEN";
    const normalizedCustomerNote = customerNote || null;
    const customerNoteWithReturnMethod = normalizedCustomerNote
      ? `${normalizedCustomerNote}\n\nPreferred return method: ${preferredReturnMethod}`
      : `Preferred return method: ${preferredReturnMethod}`;

    const customerSnapshots = resolveCustomerSnapshots(
      customer as unknown as Record<string, unknown>,
    );

    const created = await prisma.orderActionRequest.create({
      data: {
        shopId: shop.id,
        requestType: "EXCHANGE",
        customerProfileId: customer.id,
        shopifyCustomerId: customer.shopifyCustomerId || null,
        shopifyOrderId,
        orderNumber,
        status: initialStatus,
        reason,
        customerNote: customerNoteWithReturnMethod,
        customerNameSnapshot: customerSnapshots.customerNameSnapshot,
        customerPhoneSnapshot: customerSnapshots.customerPhoneSnapshot,
        customerEmailSnapshot: customerSnapshots.customerEmailSnapshot,
        orderAmountSnapshot: amountSnapshot,
        deliveryDateSnapshot: resolvedDeliveredAt
          ? new Date(resolvedDeliveredAt)
          : null,
        eligibilityDecision: eligibility.decision,
        eligibilityReason: eligibility.reason,
        items: {
          create: {
            shopifyLineItemId:
              orderedLine.shopifyLineItemId || shopifyLineItemId,
            productTitle: orderedLine.productTitle || productTitle,
            variantTitle: orderedLine.variantTitle || variantTitle,
            sku: orderedLine.sku || sku,
            currentSize: orderedLine.currentSize || currentSize,
            requestedSize,
            quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
            isClearance: eligibility.reason.toLowerCase().includes("clearance"),
            isExcludedCategory: eligibility.reason
              .toLowerCase()
              .includes("category"),
            eligibilitySnapshot: {
              ...eligibility,
              original: {
                shopifyLineItemId:
                  orderedLine.shopifyLineItemId || shopifyLineItemId,
                shopifyProductId: orderedLine.productId,
                shopifyVariantId: orderedLine.variantId,
                sku: orderedLine.sku || sku,
                size: orderedLine.currentSize || currentSize,
              },
              requestedReplacement: {
                shopifyProductId: selectedReplacement.productId,
                shopifyVariantId: selectedReplacement.variantId,
                sku: selectedReplacement.sku || requestedSku,
                size: selectedReplacement.size,
                title: selectedReplacement.title,
              },
            },
          },
        },
      },
      include: {
        items: true,
        payments: true,
      },
    });

    try {
      await sendExchangeRequestCreatedEmail({
        requestId: created.id,
        customerName: created.customerNameSnapshot,
        customerPhone: created.customerPhoneSnapshot,
        customerEmail: created.customerEmailSnapshot,
        orderNumber: created.orderNumber,
        itemTitle: created.items[0]?.productTitle || productTitle,
        currentSize: created.items[0]?.currentSize || currentSize,
        requestedSize: created.items[0]?.requestedSize || requestedSize,
        customerNote: created.customerNote,
        status: created.status,
      });
    } catch (error) {
      console.error("[EXCHANGE NOTIFY] Route-level send failed", {
        requestId: created.id,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
    }

    return withCors(
      req,
      NextResponse.json(
        {
          request: created,
          stockReviewMessage:
            eligibility.stockReviewMessage ||
            "Exchange approval depends on the availability of the requested size. If unavailable, our team will contact you with next steps.",
        },
        { status: 201 },
      ),
    );
  } catch (error) {
    const status = error instanceof ShopResolutionError ? error.status : 500;

    return withCors(
      req,
      NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed" },
        { status },
      ),
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthenticatedExchangeCustomer(req);
    if (!auth) {
      return withCors(
        req,
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      );
    }

    const { shop, session } = auth;
    const status = req.nextUrl.searchParams.get("status")?.trim() || undefined;

    const requests = await prisma.orderActionRequest.findMany({
      where: {
        shopId: shop.id,
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

    const hydratedRequests = requests.map((request) => {
      const latestPayment = request.payments[0] || null;
      const canPayReversePickup =
        request.status === "AWAITING_PAYMENT" &&
        latestPayment?.purpose === "REVERSE_PICKUP_FEE" &&
        latestPayment.status !== "PAID";

      return {
        ...request,
        canPayReversePickup,
        paymentActionEndpoint: canPayReversePickup
          ? `/api/account/exchange-requests/${request.id}/payment-link`
          : null,
      };
    });

    return withCors(req, NextResponse.json({ requests: hydratedRequests }));
  } catch (error) {
    const status = error instanceof ShopResolutionError ? error.status : 500;

    return withCors(
      req,
      NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed" },
        { status },
      ),
    );
  }
}
