import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "../../_lib/cors";
import { prisma } from "../../../../services/db/prisma";
import { hashSessionToken } from "../../../../services/auth/session";
import {
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

    let shopifyDashboard = null;
    if (isShopifyAdminConfigured() && customer.shopifyCustomerId) {
      try {
        shopifyDashboard = await getShopifyCustomerDashboardData(customer.shopifyCustomerId);
      } catch (error) {
        console.error("[DASHBOARD SUMMARY] Shopify customer fetch failed", error);
      }
    }

    const response = {
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
      verifiedPhone: customer.phoneE164,
      email: shopifyDashboard?.email || customer.email || null,
      defaultAddress: shopifyDashboard?.defaultAddress
        ? {
            firstName: shopifyDashboard.defaultAddress.firstName || null,
            lastName: shopifyDashboard.defaultAddress.lastName || null,
            address1: shopifyDashboard.defaultAddress.address1 || null,
            address2: shopifyDashboard.defaultAddress.address2 || null,
            city: shopifyDashboard.defaultAddress.city || null,
            province: shopifyDashboard.defaultAddress.province || null,
            zip: shopifyDashboard.defaultAddress.zip || null,
            country: shopifyDashboard.defaultAddress.country || null,
            phone: shopifyDashboard.defaultAddress.phone || null,
          }
        : null,
      recentOrders: shopifyDashboard?.recentOrders || [],
      wallet: {
        storeCredit: 0,
        currency: "INR",
      },
      stats: {
        totalOrders: shopifyDashboard?.totalOrderCount || 0,
        openRequests: 0,
      },
      placeholders: {
        walletManagedBy: "megaska",
        openRequestsSource: "megaska",
      },
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
