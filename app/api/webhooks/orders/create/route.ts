import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { compareMegaskaPhoneIdentity, normalizeIndianPhone } from "../../../../../services/phone";
import { prisma } from "../../../../../services/db/prisma";
import {
  isShopifyAdminConfigured,
  normalizeIndianPhoneToE164,
  setOrderMegaskaIdentityMetafields,
  updateShopifyOrderEmail,
  updateOrderPhone,
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

export const runtime = "nodejs";

function getShopifyApiSecret() {
  return String(process.env.SHOPIFY_API_SECRET || "").trim();
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

function verifyWebhookHmac(rawBuffer: Buffer, hmacHeader: string) {
  const secret = getShopifyApiSecret();
  if (!secret || !hmacHeader) return false;

  const digest = crypto
    .createHmac("sha256", secret)
    .update(rawBuffer)
    .digest("base64");

  console.log("[Megaska Order Identity] webhook hmac compare", {
    computedPrefix: digest.slice(0, 8),
    headerPrefix: hmacHeader.slice(0, 8),
    computedLength: digest.length,
    headerLength: hmacHeader.length,
    rawBodyLength: rawBuffer.length,
  });

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

function resolveOrderContactPhone(payload: ShopifyOrderWebhookPayload) {
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

async function backfillMissingOrderEmailFromCustomerProfile(order: ShopifyOrderWebhookPayload) {
  const orderId = String(order.admin_graphql_api_id || order.id || "").trim();
  const existingEmail = resolveCheckoutContactEmail(order);

  if (existingEmail) {
    console.log("[Megaska Order Email Backfill] skipped because email already present", {
      orderId: orderId || null,
      email: existingEmail,
    });
    return;
  }

  const orderPhone = String(order.phone || order.shipping_address?.phone || order.customer?.phone || "").trim();
  if (!orderPhone) {
    console.log("[Megaska Order Email Backfill] skipped because no phone", {
      orderId: orderId || null,
    });
    return;
  }

  const normalizedPhone = normalizeIndianPhoneToE164(orderPhone);
  if (!normalizedPhone) {
    console.log("[Megaska Order Email Backfill] skipped because no phone", {
      orderId: orderId || null,
      phone: orderPhone,
    });
    return;
  }

  const customerProfile = await prisma.customerProfile.findUnique({
    where: {
      phoneE164: normalizedPhone,
    },
    select: {
      email: true,
    },
  });

  const profileEmail = String(customerProfile?.email || "").trim().toLowerCase();
  if (!profileEmail) {
    console.log("[Megaska Order Email Backfill] skipped because CustomerProfile email missing", {
      orderId: orderId || null,
      phoneE164: normalizedPhone,
    });
    return;
  }

  const orderGid = String(order.admin_graphql_api_id || `gid://shopify/Order/${order.id || ""}`).trim();
  if (!orderGid || orderGid === "gid://shopify/Order/") {
    throw new Error("Missing order gid");
  }

  console.log("[Megaska Order Email Backfill] attempting Shopify order email backfill", {
    orderId: orderId || null,
    orderGid,
    phoneE164: normalizedPhone,
    email: profileEmail,
  });

  const result = await updateShopifyOrderEmail(orderGid, profileEmail);
  const updateError = result.userErrors[0]?.message;

  if (updateError) {
    throw new Error(updateError);
  }

  console.log("[Megaska Order Email Backfill] success", {
    orderId: orderId || null,
    orderGid,
    email: result.order?.email || profileEmail,
  });
}

export async function POST(req: NextRequest) {
  const rawBuffer = Buffer.from(await req.arrayBuffer());
  const rawBody = rawBuffer.toString("utf8");
  const hmacHeader = String(req.headers.get("x-shopify-hmac-sha256") || "").trim();

  console.log("[Megaska Order Identity] webhook hmac debug", {
    hasShopifyApiSecret: Boolean(String(process.env.SHOPIFY_API_SECRET || "").trim()),
    secretLength: String(process.env.SHOPIFY_API_SECRET || "").trim().length,
    hasHmacHeader: Boolean(hmacHeader),
    hmacHeaderLength: hmacHeader.length,
    topic: String(req.headers.get("x-shopify-topic") || "").trim() || null,
    shopDomain: String(req.headers.get("x-shopify-shop-domain") || "").trim() || null,
  });

  if (!verifyWebhookHmac(rawBuffer, hmacHeader)) {
    console.warn("[Megaska Order Identity] webhook rejected - invalid hmac");
    return NextResponse.json(
      { ok: false, error: "Invalid webhook signature" },
      { status: 401 }
    );
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

  const orderContactPhone = resolveOrderContactPhone(payload);
  const orderContactEmail = resolveCheckoutContactEmail(payload);

  const phoneMatch = compareMegaskaPhoneIdentity({
    verifiedPhone,
    orderPhone: orderContactPhone,
  });

  console.log("[Megaska Order Identity] webhook received", {
    topic,
    shopDomain,
    orderId: orderId || null,
    hasVerifiedPhone: Boolean(verifiedPhone),
    phoneVerified,
  });

  try {
    await backfillMissingOrderEmailFromCustomerProfile(payload);
  } catch (error) {
    console.error("[Megaska Order Email Backfill] failure", {
      orderId: orderId || null,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  console.log("[Megaska Verified Phone] trusted identity extracted", {
    orderId: orderId || null,
    trustedVerifiedPhone: verifiedPhone || null,
    trustedVerifiedPhoneNormalized: phoneMatch.verifiedPhoneNormalized || null,
    verificationCompletedAt: verificationCompletedAt || null,
  });

  console.log("[Megaska Phone Match] comparison computed", {
    orderId: orderId || null,
    originalOrderPhone: orderContactPhone || null,
    originalOrderPhoneNormalized: phoneMatch.orderPhoneNormalized || null,
    orderContactEmail: orderContactEmail || null,
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
    const normalizedVerifiedPhone = normalizeIndianPhone(verifiedPhone) || verifiedPhone;
    const correctionEligible = phoneMatch.status === "mismatch" || phoneMatch.status === "missing_order_phone";

    let correctionAttempted = false;
    let phoneCorrected = false;
    let correctedOrderPhone = "";
    let correctionError = "";

    if (correctionEligible) {
      correctionAttempted = true;
      console.log("[Megaska Phone Correction] correction attempt started", {
        orderId,
        phoneMatchStatus: phoneMatch.status,
        trustedVerifiedPhone: normalizedVerifiedPhone,
        originalOrderPhone: orderContactPhone || null,
      });

      try {
        const correctionResult = await updateOrderPhone({
          orderId,
          phone: normalizedVerifiedPhone,
        });

        const updateError = correctionResult.userErrors[0]?.message;
        if (updateError) {
          correctionError = updateError;
          console.error("[Megaska Phone Correction] correction failed", {
            orderId,
            error: correctionError,
          });
        } else {
          phoneCorrected = true;
          correctedOrderPhone = String(correctionResult.order?.phone || normalizedVerifiedPhone).trim();
          console.log("[Megaska Phone Correction] correction succeeded", {
            orderId,
            correctedOrderPhone: correctedOrderPhone || normalizedVerifiedPhone,
          });
        }
      } catch (error) {
        correctionError = error instanceof Error ? error.message : "Unknown error";
        console.error("[Megaska Phone Correction] correction failed", {
          orderId,
          error: correctionError,
        });
      }
    }

    const result = await setOrderMegaskaIdentityMetafields({
      orderId,
      verifiedPhone: normalizedVerifiedPhone,
      phoneVerified,
      authSource,
      customerProfileId,
      shopifyCustomerId,
      verificationCompletedAt,
      phoneMatchStatus: phoneMatch.status,
      mismatchDetected: phoneMatch.mismatchDetected,
      originalCheckoutPhone: orderContactPhone,
      orderContactEmail,
      correctedOrderPhone,
      phoneCorrected,
      correctionAttempted,
      correctionError,
    });

    console.log("[Megaska Order Identity] metafields and tags written", {
      orderId,
      keys: result.metafields.map((metafield) => metafield.key),
      tags: result.tags,
      userErrors: result.userErrors,
      correctionAttempted,
      phoneCorrected,
    });

    return NextResponse.json({
      ok: true,
      orderId,
      phoneMatchStatus: phoneMatch.status,
      mismatchDetected: phoneMatch.mismatchDetected,
      correctionAttempted,
      phoneCorrected,
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
