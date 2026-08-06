import { NextRequest, NextResponse } from "next/server";

const REQUIRED_CORS_HEADERS = [
  "Content-Type",
  "Authorization",
  "x-shopify-shop-domain",
];

function isAllowedShopifyStorefrontOrigin(origin: string) {
  return /^https:\/\/[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(origin);
}

function getAllowedOrigin(req: NextRequest) {
  const origin = String(req.headers.get("origin") || "").trim();

  if (!origin) {
    return "*";
  }

  if (isAllowedShopifyStorefrontOrigin(origin)) {
    return origin;
  }

  return origin;
}

function getRequestedHeaders(req: NextRequest) {
  const requested = String(
    req.headers.get("access-control-request-headers") || ""
  ).trim();

  if (!requested) {
    return REQUIRED_CORS_HEADERS.join(", ");
  }

  const requestedSet = new Set(
    requested
      .split(",")
      .map((header) => header.trim().toLowerCase())
      .filter(Boolean)
  );

  const merged = [...REQUIRED_CORS_HEADERS];

  for (const header of requestedSet) {
    if (!merged.some((requiredHeader) => requiredHeader.toLowerCase() === header)) {
      merged.push(header);
    }
  }

  return merged.join(", ");
}

export function withCors(req: NextRequest, res: NextResponse) {
  const origin = getAllowedOrigin(req);
  const allowHeaders = getRequestedHeaders(req);

  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Vary", "Origin, Access-Control-Request-Headers");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", allowHeaders);
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Max-Age", "86400");

  return res;
}

export function handleOptions(req: NextRequest) {
  return withCors(req, new NextResponse(null, { status: 204 }));
}
