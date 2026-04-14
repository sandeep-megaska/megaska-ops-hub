import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "../../_lib/cors";
import { prisma } from "../../../../services/db/prisma";
import { hashSessionToken } from "../../../../services/auth/session";
import { resolveCartId, updateCartBuyerIdentity } from "../../../../services/shopify/storefront";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : "";

    const queryToken = req.nextUrl.searchParams.get("token")?.trim() ?? "";
    const sessionToken = bearerToken || queryToken;

    if (!sessionToken) {
      return withCors(
        req,
        NextResponse.json({ ok: false, error: "Session token required" }, { status: 401 })
      );
    }

    const body = (await req.json().catch(() => ({}))) as {
      cartId?: string;
      cartToken?: string;
    };

    const cartId = resolveCartId({
      cartId: body.cartId,
      cartToken: body.cartToken,
    });

    if (!cartId) {
      return withCors(
        req,
        NextResponse.json({ ok: false, error: "cartId/cartToken required" }, { status: 400 })
      );
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

    if (!session?.customer) {
      return withCors(
        req,
        NextResponse.json({ ok: false, error: "Invalid session" }, { status: 401 })
      );
    }

    const customer = session.customer;

    // 🧠 Apply buyer identity to Shopify cart
    const identityResult = await updateCartBuyerIdentity({
      cartId,
      buyerIdentity: {
        email: customer.email || undefined,
        phone: customer.phoneE164 || undefined,
        firstName: customer.firstName || undefined,
        lastName: customer.lastName || undefined,
        address1: customer.addressLine1 || undefined,
        address2: customer.addressLine2 || undefined,
        city: customer.city || undefined,
        province: customer.stateProvince || undefined,
        zip: customer.postalCode || undefined,
        country: customer.countryRegion || undefined,
      },
    });

    if (!identityResult.ok) {
      return withCors(
        req,
        NextResponse.json({
          ok: false,
          error: "Failed to apply buyer identity",
          details: identityResult.userErrors,
        })
      );
    }

    const checkoutUrl = identityResult.checkoutUrl || "/checkout";

    return withCors(
      req,
      NextResponse.json({
        ok: true,
        checkoutUrl,
      })
    );
  } catch (error) {
    return withCors(
      req,
      NextResponse.json(
        {
          ok: false,
          error: error instanceof Error ? error.message : "Failed",
        },
        { status: 500 }
      )
    );
  }
}
