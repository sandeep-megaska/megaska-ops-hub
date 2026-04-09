import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "../../_lib/cors";
import { prisma } from "../../../../services/db/prisma";
import { hashSessionToken } from "../../../../services/auth/session";
import {
  findShopifyCustomerIdByIdentity,
  getShopifyCustomerDashboardData,
  isShopifyAdminConfigured,
} from "../../../../services/shopify/admin";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

function getSessionToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const queryToken = req.nextUrl.searchParams.get("token")?.trim() ?? "";
  return bearerToken || queryToken;
}

export async function GET(req: NextRequest) {
  try {
    const sessionToken = getSessionToken(req);
    if (!sessionToken) {
      return withCors(req, NextResponse.json({ error: "Session token required" }, { status: 401 }));
    }

    const now = new Date();
    const session = await prisma.authSession.findFirst({
      where: {
        sessionTokenHash: hashSessionToken(sessionToken),
        revokedAt: null,
        expiresAt: { gt: now },
      },
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!session) {
      return withCors(req, NextResponse.json({ error: "Invalid or expired session" }, { status: 401 }));
    }

    await prisma.authSession.update({
      where: { id: session.id },
      data: { lastSeenAt: now },
    });

    const customer = session.customer;

    let resolvedShopifyCustomerId = String(customer.shopifyCustomerId || "").trim();
    let shopifyDashboard = null;

    console.log("[DASHBOARD SUMMARY] start", {
      customerId: customer.id,
      phoneE164: customer.phoneE164,
      email: customer.email,
      existingShopifyCustomerId: customer.shopifyCustomerId,
      adminConfigured: isShopifyAdminConfigured(),
    });

    if (isShopifyAdminConfigured()) {
      try {
        if (!resolvedShopifyCustomerId) {
          resolvedShopifyCustomerId =
            (await findShopifyCustomerIdByIdentity({
              email: customer.email,
              phoneE164: customer.phoneE164,
            })) || "";

          console.log("[DASHBOARD SUMMARY] lookup result", {
            resolvedShopifyCustomerId,
          });

          if (resolvedShopifyCustomerId) {
            await prisma.customerProfile.update({
              where: { id: customer.id },
              data: { shopifyCustomerId: resolvedShopifyCustomerId },
            });
          }
        }

        if (resolvedShopifyCustomerId) {
          shopifyDashboard = await getShopifyCustomerDashboardData(resolvedShopifyCustomerId);

          console.log("[DASHBOARD SUMMARY] dashboard result", {
            resolvedShopifyCustomerId,
            foundEmail: shopifyDashboard?.email || null,
            totalOrderCount: shopifyDashboard?.totalOrderCount || 0,
            recentOrdersCount: Array.isArray(shopifyDashboard?.recentOrders)
              ? shopifyDashboard.recentOrders.length
              : 0,
            hasDefaultAddress: Boolean(shopifyDashboard?.defaultAddress),
          });
        } else {
          console.log("[DASHBOARD SUMMARY] no Shopify customer resolved");
        }
      } catch (error) {
        console.error("[DASHBOARD SUMMARY] Shopify customer fetch failed", error);
      }
    }

    const savedAddressCount = shopifyDashboard?.defaultAddress
      ? 1
      : customer.addressLine1
        ? 1
        : 0;

    const totalOrders = Number(shopifyDashboard?.totalOrderCount || 0);

    const response = {
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phoneE164,
        email: shopifyDashboard?.email || customer.email || null,
        verified: Boolean(customer.phoneVerifiedAt),
      },
      wallet: {
        balance: 0,
        currency: "INR",
        pendingRefund: 0,
      },
      stats: {
        totalOrders,
        openRequests: 0,
        savedAddresses: savedAddressCount,
      },
      address: shopifyDashboard?.defaultAddress
        ? {
            line1: shopifyDashboard.defaultAddress.address1 || null,
            line2: shopifyDashboard.defaultAddress.address2 || null,
            city: shopifyDashboard.defaultAddress.city || null,
            state: shopifyDashboard.defaultAddress.province || null,
            postalCode: shopifyDashboard.defaultAddress.zip || null,
            country: shopifyDashboard.defaultAddress.country || null,
          }
        : customer.addressLine1
          ? {
              line1: customer.addressLine1 || null,
              line2: customer.addressLine2 || null,
              city: customer.city || null,
              state: customer.stateProvince || null,
              postalCode: customer.postalCode || null,
              country: customer.countryRegion || null,
            }
          : null,
      orders: shopifyDashboard?.recentOrders || [],
    };

    return withCors(req, NextResponse.json(response));
  } catch (error) {
    console.error("[DASHBOARD SUMMARY ERROR]", error);

    return withCors(
      req,
      NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Internal error",
        },
        { status: 500 }
      )
    );
  }
}
