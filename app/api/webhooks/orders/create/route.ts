import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { compareMegaskaPhoneIdentity, normalizeIndianPhone } from "../../../../../services/phone";
import {
  isShopifyAdminConfigured,
  setOrderMegaskaIdentityMetafields,
} from "../../../../../services/shopify/admin";

type ShopifyOrderWebhookPayload = {
  id?: number | string;
  admin_graphql_api_id?: string;
  email?: string;
  contact_email?: string;
  phone?: string;
  customer?: {
    email?: string;
    phone?: string;
  };
  shipping_address?: {
    phone?: string;
  };
  billing_address?: {
    phone?: string;
  };
  note_attributes?: Array<{ name?: string; value?: string }>;
};

function getShopifyApiSecret() {
  return String(process.env.SHOPIFY_API_SECRET || "").trim();
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

function verifyWebhookHmac(rawBody: string, hmacHeader: string) {
  const secret = getShopifyApiSecret();
  if (!secret || !hmacHeader) return false;

  const digest = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  return safeEqual(digest, hmacHeader);
}

function toAttributeMap(noteAttributes: ShopifyOrderWebhookPayload["note_attributes"]) {
  const map: Record<string, string> = {};

  (noteAttributes || []).forEach((entry) => {
    const key = String(entry?.name || "").trim();
    const value = String(entry?.value || "").trim();
    if (!key || !value) return;
    map[key] = value;
  });

  return map;
}

function resolveCheckoutContactPhone(payload: ShopifyOrderWebhookPayload) {
  return String(
    payload.phone ||
      payload.shipping_address?.phone ||
      payload.billing_address?.phone ||
      payload.customer?.phone ||
      ""
  ).trim();
}

function resolveCheckoutContactEmail(payload: ShopifyOrderWebhookPayload) {
  return String(payload.email || payload.contact_email || payload.customer?.email || "").trim();
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const hmacHeader = String(req.headers.get("x-shopify-hmac-sha256") || "").trim();

  if (!verifyWebhookHmac(rawBody, hmacHeader)) {
    console.warn("[Megaska Order Identity] webhook rejected - invalid hmac");
    return NextResponse.json({ ok: false, error: "Invalid webhook signature" }, { status: 401 });
  }

  const topic = String(req.headers.get("x-shopify-topic") || "").trim();
  const shopDomain = String(req.headers.get("x-shopify-shop-domain") || "").trim();

  let payload: ShopifyOrderWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as ShopifyOrderWebhookPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const orderId = String(payload.admin_graphql_api_id || payload.id || "").trim();
  const attributes = toAttributeMap(payload.note_attributes);

  const verifiedPhone = String(attributes.megaska_verified_phone || "").trim();
  const phoneVerified = String(attributes.megaska_phone_verified || "").trim() === "true";
  const authSource = String(attributes.megaska_auth_source || "otp").trim();
  const customerProfileId = String(attributes.megaska_customer_profile_id || "").trim();
  const shopifyCustomerId = String(attributes.megaska_shopify_customer_id || "").trim();
  const verificationCompletedAt = String(attributes.megaska_auth_verified_at || "").trim();

  const checkoutContactPhone = resolveCheckoutContactPhone(payload);
  const checkoutContactEmail = resolveCheckoutContactEmail(payload);

  const phoneMatch = compareMegaskaPhoneIdentity({
    verifiedPhone,
    checkoutPhone: checkoutContactPhone,
  });

  console.log("[Megaska Order Identity] webhook received", {
    topic,
    shopDomain,
    orderId: orderId || null,
    hasVerifiedPhone: Boolean(verifiedPhone),
    phoneVerified,
  });

  console.log("[Megaska Verified Phone] trusted identity extracted", {
    orderId: orderId || null,
    trustedVerifiedPhone: verifiedPhone || null,
    trustedVerifiedPhoneNormalized: phoneMatch.verifiedPhoneNormalized || null,
    verificationCompletedAt: verificationCompletedAt || null,
  });

  console.log("[Megaska Phone Match] comparison computed", {
    orderId: orderId || null,
    checkoutContactPhone: checkoutContactPhone || null,
    checkoutContactPhoneNormalized: phoneMatch.checkoutPhoneNormalized || null,
    checkoutContactEmail: checkoutContactEmail || null,
    phoneMatchStatus: phoneMatch.status,
    mismatchDetected: phoneMatch.mismatchDetected,
  });

  if (!orderId) {
    return NextResponse.json({ ok: false, skipped: true, reason: "missing-order-id" });
  }

  if (!verifiedPhone || !phoneVerified) {
    console.warn("[Megaska Order Identity] skipped - missing verified phone markers", {
      orderId,
      hasVerifiedPhone: Boolean(verifiedPhone),
      phoneVerified,
    });
    return NextResponse.json({ ok: true, skipped: true, reason: "missing-verification-markers" });
  }

  if (!isShopifyAdminConfigured()) {
    console.warn("[Megaska Order Identity] skipped - admin api not configured", {
      orderId,
    });
    return NextResponse.json({ ok: true, skipped: true, reason: "admin-not-configured" });
  }

  try {
    const result = await setOrderMegaskaIdentityMetafields({
      orderId,
      verifiedPhone: normalizeIndianPhone(verifiedPhone) || verifiedPhone,
      phoneVerified,
      authSource,
      customerProfileId,
      shopifyCustomerId,
      verificationCompletedAt,
      phoneMatchStatus: phoneMatch.status,
      mismatchDetected: phoneMatch.mismatchDetected,
      checkoutContactPhone,
      checkoutContactEmail,
    });

    console.log("[Megaska Order Identity] metafields and tags written", {
      orderId,
      keys: result.metafields.map((metafield) => metafield.key),
      tags: result.tags,
      userErrors: result.userErrors,
    });

    return NextResponse.json({
      ok: true,
      orderId,
      phoneMatchStatus: phoneMatch.status,
      mismatchDetected: phoneMatch.mismatchDetected,
      metafieldsWritten: result.metafields.length,
      tagsWritten: result.tags,
      userErrors: result.userErrors,
    });
  } catch (error) {
    console.error("[Megaska Order Identity] order enrichment failed", {
      orderId,
      phoneMatchStatus: phoneMatch.status,
      mismatchDetected: phoneMatch.mismatchDetected,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json({
      ok: false,
      orderId,
      phoneMatchStatus: phoneMatch.status,
      mismatchDetected: phoneMatch.mismatchDetected,
      error: error instanceof Error ? error.message : "Order identity persistence failed",
    });
  }
}
