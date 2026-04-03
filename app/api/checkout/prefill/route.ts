import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "../../_lib/cors";
import { hashSessionToken } from "../../../../services/auth/session";
import { prisma } from "../../../../services/db/prisma";
import {
  isShopifyStorefrontConfigured,
  resolveCartId,
  updateCartAttributes,
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
    const phoneVerifiedAt =
      session.customer.phoneVerifiedAt instanceof Date
        ? session.customer.phoneVerifiedAt.toISOString()
        : "";
    const customerProfileId = String(session.customer.id || "").trim();
    const shopifyCustomerId = String(session.customer.shopifyCustomerId || "").trim();
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

    if (!phone) {
      console.warn("[Megaska Checkout Gate] blocked - missing verified phone on session", {
        customerProfileId: customerProfileId || null,
        cartId: resolvedCartId,
      });
      return withCors(
        req,
        NextResponse.json(
          {
            ok: false,
            blocked: true,
            reason: "missing-verified-phone",
            cartId: resolvedCartId,
          },
          { status: 403 }
        )
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

    const verificationAttributes = [
      { key: "megaska_phone_verified", value: "true" },
      { key: "megaska_verified_phone", value: phone },
      { key: "megaska_auth_source", value: "otp" },
      { key: "megaska_customer_profile_id", value: customerProfileId },
      { key: "megaska_shopify_customer_id", value: shopifyCustomerId },
      { key: "megaska_auth_verified_at", value: phoneVerifiedAt },
    ].filter((entry) => entry.value);

    const attributeResult = await updateCartAttributes({
      cartId: resolvedCartId,
      attributes: verificationAttributes,
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
    console.log("[Megaska Verified Phone] cart verification metadata applied", {
      cartId: attributeResult.cartId || resolvedCartId,
      ok: attributeResult.ok,
      keysWritten: verificationAttributes.map((item) => item.key),
      trustedPhoneSource: "cart.attribute.megaska_verified_phone",
      userErrors: attributeResult.userErrors,
      apiErrors: attributeResult.apiErrors.map((err) => err.message || "unknown"),
    });

    console.log("[Megaska Checkout Validation] expected function target", {
      functionTarget: "cart.validations.generate.run",
      trustedPhoneAttributeKey: "megaska_verified_phone",
      trustedPhoneVerifiedFlagKey: "megaska_phone_verified",
      note: "Activate the Megaska checkout validation rule in Shopify Admin > Settings > Checkout > Checkout rules.",
    });

    return withCors(
      req,
      NextResponse.json({
        ok: updateResult.ok && attributeResult.ok,
        cartId: attributeResult.cartId || updateResult.cartId || resolvedCartId,
        checkoutUrl:
          attributeResult.checkoutUrl || updateResult.checkoutUrl || body?.checkoutUrl || null,
        buyerIdentity: updateResult.buyerIdentity || null,
        userErrors: [...updateResult.userErrors, ...attributeResult.userErrors],
        apiErrors: [...updateResult.apiErrors, ...attributeResult.apiErrors],
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
