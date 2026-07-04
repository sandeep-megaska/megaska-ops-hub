import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "../../../_lib/cors";
import { ShopResolutionError } from "../../../../../services/shopify/shop";
import { getAuthenticatedExchangeCustomer } from "../../../../../services/exchange/auth";
import {
  listSameProductReplacementVariants,
  resolveOrderedExchangeLine,
} from "../../../../../services/exchange/replacement-variants";

export const runtime = "nodejs";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthenticatedExchangeCustomer(req);
    if (!auth)
      return withCors(
        req,
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      );

    const { shop, session } = auth;
    const params = req.nextUrl.searchParams;
    const orderNumber = String(params.get("orderNumber") || "").trim();
    if (!orderNumber)
      return withCors(
        req,
        NextResponse.json(
          { error: "orderNumber is required" },
          { status: 400 },
        ),
      );

    const orderedLine = await resolveOrderedExchangeLine({
      shopDomain: shop.shopDomain,
      customerShopifyId: session.customer.shopifyCustomerId,
      customerEmail: session.customer.email,
      customerPhone: session.customer.phoneE164,
      orderNumber,
      shopifyOrderId: params.get("shopifyOrderId"),
      shopifyLineItemId: params.get("shopifyLineItemId"),
      productId: params.get("productId"),
      variantId: params.get("variantId"),
      sku: params.get("sku"),
      productTitle: params.get("productTitle"),
      variantTitle: params.get("variantTitle"),
      currentSize: params.get("currentSize"),
    });

    if (!orderedLine.productId) {
      return withCors(
        req,
        NextResponse.json(
          { error: "Unable to identify the ordered Shopify product." },
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

    return withCors(
      req,
      NextResponse.json({ orderedLine, replacementOptions }),
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
