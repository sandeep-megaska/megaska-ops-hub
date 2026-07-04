import { shopifyAdminGraphql } from "../express-checkout/shopify-admin";
import {
  getMegaskaCustomerDashboardData,
  MegaskaDashboardLineItem,
} from "../shopify/dashboard";

export type ExchangeReplacementVariant = {
  productId: string;
  variantId: string;
  title: string;
  sku: string | null;
  size: string;
  availableForSale: boolean | null;
  inventoryQuantity: number | null;
};

export type ExchangeOrderedLine = {
  shopifyLineItemId: string | null;
  productId: string | null;
  variantId: string | null;
  sku: string | null;
  productTitle: string | null;
  variantTitle: string | null;
  currentSize: string | null;
};

function normalizeOrderNumber(value: string | null | undefined) {
  const trimmed = String(value || "").trim();
  return trimmed.startsWith("#") ? trimmed : trimmed ? `#${trimmed}` : "";
}

function toProductGid(value: string | null | undefined) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (raw.startsWith("gid://shopify/Product/")) return raw;
  if (/^\d+$/.test(raw)) return `gid://shopify/Product/${raw}`;
  return raw;
}

function selectedSize(
  options:
    Array<{ name?: string | null; value?: string | null }> | null | undefined,
  fallback: string | null | undefined,
) {
  const size = (options || []).find(
    (option) =>
      String(option?.name || "")
        .trim()
        .toLowerCase() === "size",
  );
  return String(size?.value || fallback || "").trim();
}

export async function resolveOrderedExchangeLine(input: {
  shopDomain: string;
  customerShopifyId?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  orderNumber: string;
  shopifyOrderId?: string | null;
  shopifyLineItemId?: string | null;
  productId?: string | null;
  variantId?: string | null;
  sku?: string | null;
  productTitle?: string | null;
  variantTitle?: string | null;
  currentSize?: string | null;
}): Promise<ExchangeOrderedLine> {
  const supplied: ExchangeOrderedLine = {
    shopifyLineItemId: input.shopifyLineItemId || null,
    productId: input.productId || null,
    variantId: input.variantId || null,
    sku: input.sku || null,
    productTitle: input.productTitle || null,
    variantTitle: input.variantTitle || null,
    currentSize: input.currentSize || null,
  };
  if (supplied.productId && supplied.variantId) return supplied;

  const dashboard = await getMegaskaCustomerDashboardData({
    shopDomain: input.shopDomain,
    customerId: input.customerShopifyId,
    email: input.customerEmail,
    phoneE164: input.customerPhone,
  });
  const targetOrderNumber = normalizeOrderNumber(input.orderNumber);
  const order = dashboard?.recentOrders.find((candidate) => {
    return Boolean(
      (input.shopifyOrderId &&
        candidate.shopifyOrderId === input.shopifyOrderId) ||
      (targetOrderNumber &&
        normalizeOrderNumber(candidate.name) === targetOrderNumber),
    );
  });
  const lines = order?.lineItems || [];
  const matched =
    lines.find((line: MegaskaDashboardLineItem) => {
      if (
        input.shopifyLineItemId &&
        line.shopifyLineItemId === input.shopifyLineItemId
      )
        return true;
      if (input.variantId && line.variantId === input.variantId) return true;
      if (input.sku && line.sku === input.sku) return true;
      return false;
    }) ||
    lines.find(
      (line) =>
        String(line.productTitle || line.title || "")
          .trim()
          .toLowerCase() ===
        String(input.productTitle || "")
          .trim()
          .toLowerCase(),
    ) ||
    null;

  return {
    shopifyLineItemId:
      supplied.shopifyLineItemId || matched?.shopifyLineItemId || null,
    productId: supplied.productId || matched?.productId || null,
    variantId: supplied.variantId || matched?.variantId || null,
    sku: supplied.sku || matched?.sku || null,
    productTitle:
      supplied.productTitle || matched?.productTitle || matched?.title || null,
    variantTitle: supplied.variantTitle || matched?.variantTitle || null,
    currentSize: supplied.currentSize || matched?.currentSize || null,
  };
}

export async function listSameProductReplacementVariants(input: {
  shopId: string;
  shopDomain: string;
  productId: string;
  currentVariantId?: string | null;
}): Promise<ExchangeReplacementVariant[]> {
  const data = await shopifyAdminGraphql<{
    product: {
      id: string;
      variants: {
        nodes: Array<{
          id: string;
          title: string;
          sku?: string | null;
          availableForSale?: boolean | null;
          inventoryQuantity?: number | null;
          selectedOptions?: Array<{
            name?: string | null;
            value?: string | null;
          }> | null;
        }>;
      };
    } | null;
  }>(
    input.shopDomain,
    `query ExchangeProductVariants($id: ID!) { product(id: $id) { id variants(first: 100) { nodes { id title sku availableForSale inventoryQuantity selectedOptions { name value } } } } }`,
    { id: toProductGid(input.productId) },
    { shopId: input.shopId },
  );

  const currentVariantId = String(input.currentVariantId || "").trim();
  return (data.product?.variants.nodes || [])
    .map((variant) => ({
      productId: data.product?.id || toProductGid(input.productId),
      variantId: variant.id,
      title: variant.title,
      sku: variant.sku || null,
      size: selectedSize(variant.selectedOptions, variant.title),
      availableForSale:
        typeof variant.availableForSale === "boolean"
          ? variant.availableForSale
          : null,
      inventoryQuantity:
        typeof variant.inventoryQuantity === "number"
          ? variant.inventoryQuantity
          : null,
    }))
    .filter(
      (variant) => variant.variantId && variant.variantId !== currentVariantId,
    )
    .filter((variant) => variant.size)
    .filter(
      (variant) =>
        variant.inventoryQuantity === null || variant.inventoryQuantity > 0,
    )
    .filter((variant) => variant.availableForSale !== false);
}
