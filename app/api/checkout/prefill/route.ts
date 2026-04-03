import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "../../_lib/cors";
import { hashSessionToken } from "../../../../services/auth/session";
import { prisma } from "../../../../services/db/prisma";
import {
  isShopifyStorefrontConfigured,
  resolveCartId,
  updateCartBuyerIdentity,
} from "../../../../services/shopify/storefront";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : "";

    if (!bearerToken) {
      return withCors(
        req,
        NextResponse.json({ ok: false, error: "Session token required" }, { status: 401 })
      );
    }

    const sessionTokenHash = hashSessionToken(bearerToken);
    const now = new Date();
    const session = await prisma.authSession.findFirst({
      where: {
        sessionTokenHash,
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
        NextResponse.json({ ok: false, error: "Invalid or expired session" }, { status: 401 })
      );
    }

    const body = (await req.json()) as {
      cartId?: string;
      cartToken?: string;
      checkoutUrl?: string;
    };

    const email = String(session.customer.email || "").trim();
    const phone = String(session.customer.phoneE164 || "").trim();
    const resolvedCartId = resolveCartId({
      cartId: body?.cartId,
      cartToken: body?.cartToken,
    });
    const cartSource = String(body?.cartId || "").trim()
      ? "body.cartId"
      : String(body?.cartToken || "").trim()
        ? "body.cartToken"
        : "none";

    console.log("[Megaska Checkout Prefill] resolved active cart", {
      cartId: resolvedCartId || null,
      cartSource,
      cartIdProvided: Boolean(String(body?.cartId || "").trim()),
      cartTokenProvided: Boolean(String(body?.cartToken || "").trim()),
      checkoutUrl: String(body?.checkoutUrl || "").trim() || null,
    });

    if (!isShopifyStorefrontConfigured()) {
      console.warn("[Megaska Buyer Identity] skipped - storefront api not configured");
      return withCors(
        req,
        NextResponse.json({
          ok: false,
          skipped: true,
          reason: "storefront-not-configured",
          cartId: resolvedCartId || null,
        })
      );
    }

    if (!resolvedCartId) {
      return withCors(
        req,
        NextResponse.json({
          ok: false,
          skipped: true,
          reason: "missing-cart-id",
          cartId: null,
        })
      );
    }

    const hasBuyerIdentity = Boolean(email || phone);
    if (!hasBuyerIdentity) {
      return withCors(
        req,
        NextResponse.json({
          ok: true,
          skipped: true,
          reason: "missing-profile-contact",
          cartId: resolvedCartId,
        })
      );
    }

    console.log("[Megaska Buyer Identity] update started", {
      cartId: resolvedCartId,
      email: email || null,
      phone: phone || null,
    });

    const updateResult = await updateCartBuyerIdentity({
      cartId: resolvedCartId,
      buyerIdentity: {
        email,
        phone,
      },
    });

    console.log("[Megaska Buyer Identity] update completed", {
      targetCartId: resolvedCartId,
      resultCartId: updateResult.cartId || null,
      resultBuyerIdentity: updateResult.buyerIdentity || null,
      ok: updateResult.ok,
      userErrors: updateResult.userErrors,
      apiErrors: updateResult.apiErrors.map((err) => err.message || "unknown"),
      checkoutUrlReturned: Boolean(updateResult.checkoutUrl),
    });

    return withCors(
      req,
      NextResponse.json({
        ok: updateResult.ok,
        cartId: updateResult.cartId || resolvedCartId,
        checkoutUrl: updateResult.checkoutUrl || body?.checkoutUrl || null,
        buyerIdentity: updateResult.buyerIdentity || null,
        userErrors: updateResult.userErrors,
        apiErrors: updateResult.apiErrors,
      })
    );
  } catch (error) {
    console.error("[Megaska Checkout Prefill] failed", error);
    return withCors(
      req,
      NextResponse.json(
        {
          ok: false,
          error: error instanceof Error ? error.message : "Internal error",
        },
        { status: 500 }
      )
    );
  }
}
