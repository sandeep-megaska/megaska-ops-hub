import crypto from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function fingerprint(value: string) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

export async function GET() {
  const apiSecret = String(process.env.SHOPIFY_API_SECRET || "").trim();
  const webhookSecret = String(process.env.SHOPIFY_WEBHOOK_SECRET || "").trim();
  const apiSecret1 = String(process.env.SHOPIFY_API_SECRET1 || "").trim();

  return NextResponse.json({
    ok: true,
    shopifyApiSecret: {
      exists: Boolean(apiSecret),
      length: apiSecret.length,
      sha256: apiSecret ? fingerprint(apiSecret) : null,
      prefix: apiSecret ? apiSecret.slice(0, 4) : null,
      suffix: apiSecret ? apiSecret.slice(-4) : null,
    },
    shopifyWebhookSecret: {
      exists: Boolean(webhookSecret),
      length: webhookSecret.length,
      sha256: webhookSecret ? fingerprint(webhookSecret) : null,
      prefix: webhookSecret ? webhookSecret.slice(0, 4) : null,
      suffix: webhookSecret ? webhookSecret.slice(-4) : null,
    },
    shopifyApiSecret1: {
      exists: Boolean(apiSecret1),
      length: apiSecret1.length,
      sha256: apiSecret1 ? fingerprint(apiSecret1) : null,
      prefix: apiSecret1 ? apiSecret1.slice(0, 4) : null,
      suffix: apiSecret1 ? apiSecret1.slice(-4) : null,
    },
  });
}
