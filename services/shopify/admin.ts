const SHOPIFY_API_VERSION = "2026-01";

type ShopifyCustomerNode = {
  id: string;
  email?: string | null;
  phone?: string | null;
};

type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

type ShopifyMailingAddress = {
  firstName?: string | null;
  lastName?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  province?: string | null;
  zip?: string | null;
  country?: string | null;
  phone?: string | null;
};

type ShopifyCustomerSyncInput = {
  fullName?: string | null;
  email?: string | null;
  phoneE164?: string | null;
};

type ShopifyCustomerSyncResult = {
  shopifyCustomerId: string;
  source: "existing" | "created";
  matchedBy?: "email" | "phone";
};

type ShopifyCustomerLookupInput = {
  email?: string | null;
  phoneE164?: string | null;
};


export type OrderMegaskaIdentityInput = {
  orderId: string;
  verifiedPhone: string;
  phoneVerified: boolean;
  authSource: string;
  customerProfileId?: string | null;
  shopifyCustomerId?: string | null;
  verificationCompletedAt?: string | null;
  phoneMatchStatus?: "match" | "mismatch" | "missing_order_phone" | "missing_verified_phone";
  originalCheckoutPhone?: string | null;
  orderContactEmail?: string | null;
  mismatchDetected?: boolean;
  correctedOrderPhone?: string | null;
  phoneCorrected?: boolean;
  correctionAttempted?: boolean;
  correctionError?: string | null;
};

export type ShopifyRecentOrder = {
  id: string;
  shopifyOrderId: string;
  name: string;
  processedAt: string | null;
  deliveredAt: string | null;
  totalAmount: string | null;
  currencyCode: string | null;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  statusPageUrl: string | null;
  displayTitle?: string | null;
  displayImage?: string | null;
  itemsCount?: number | null;
  firstLineItemId?: string | null;
  firstLineItemTitle?: string | null;
  firstLineItemVariantTitle?: string | null;
  firstLineItemSku?: string | null;
};

export type ShopifyCustomerDashboardData = {
  email: string | null;
  phone: string | null;
  defaultAddress: ShopifyMailingAddress | null;
  totalOrderCount: number;
  recentOrders: ShopifyRecentOrder[];
};

function getShopDomain() {
  return (process.env.SHOPIFY_STORE_DOMAIN || "")
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}


function splitName(fullNameRaw: string | null | undefined) {
  const normalized = String(fullNameRaw || "").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return { firstName: "", lastName: "" };
  }

  const [firstName, ...rest] = normalized.split(" ");
  return {
    firstName: firstName || "",
    lastName: rest.join(" ").trim(),
  };
}

function normalizeEmail(emailRaw: string | null | undefined) {
  const value = String(emailRaw || "").trim().toLowerCase();
  return value || "";
}

function normalizePhone(phoneRaw: string | null | undefined) {
  return String(phoneRaw || "").trim();
}

function parseCustomerId(gidOrId: string) {
  const trimmed = String(gidOrId || "").trim();
  const gidMatch = trimmed.match(/Customer\/(\d+)$/);
  return gidMatch?.[1] || trimmed;
}

function resolveOrderGid(orderId: string) {
  const trimmed = String(orderId || "").trim();
  if (trimmed.startsWith("gid://shopify/Order/")) return trimmed;
  return `gid://shopify/Order/${trimmed}`;
}

function resolveCustomerGid(customerId: string) {
  const trimmed = String(customerId || "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("gid://shopify/Customer/")) return trimmed;
  if (/^\d+$/.test(trimmed)) return `gid://shopify/Customer/${trimmed}`;
  return "";
}

export function normalizeIndianPhoneToE164(input: string | null | undefined) {
  const raw = String(input || "").trim();
  if (!raw) return null;

  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  return null;
}

function maskToken(token: string) {
  const trimmed = String(token || "").trim();
  if (!trimmed) return "";
  if (trimmed.length <= 8) return `${"*".repeat(trimmed.length)}`;
  return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)}`;
}

function getAdminAccessToken(): string {
  return String(process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "").trim();
}

async function adminGraphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const shopDomain = getShopDomain();
  const token = getAdminAccessToken();

  if (!shopDomain || !token) {
    throw new Error("Shopify admin sync is not configured (missing store domain or admin access token)");
  }

  console.log("[SHOPIFY AUTH SERVER] calling admin graphql", {
    shopDomain,
    apiVersion: SHOPIFY_API_VERSION,
    tokenSource: "env.SHOPIFY_ADMIN_ACCESS_TOKEN",
    tokenMasked: maskToken(token),
    tokenPrefix: String(token || "").slice(0, 6),
    queryKind: query.includes("mutation") ? "mutation" : "query",
  });

  const response = await fetch(`https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables: variables || {} }),
  });

  const rawText = await response.text().catch(() => "");
  let payload: {
    data?: T;
    errors?: Array<{ message?: string }>;
  } | null = null;

  try {
    payload = rawText
      ? (JSON.parse(rawText) as {
          data?: T;
          errors?: Array<{ message?: string }>;
        })
      : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(`Shopify admin request failed (${response.status}) ${rawText || ""}`.trim());
  }

  if (payload?.errors?.length) {
    const message = payload.errors.map((error) => error.message).filter(Boolean).join(", ");
    throw new Error(message || "Shopify admin GraphQL error");
  }

  if (!payload?.data) {
    throw new Error("Shopify admin response missing data");
  }

  return payload.data;
}

export function isShopifyAdminConfigured() {
  return Boolean(getShopDomain() && getAdminAccessToken());
}


export async function debugShopifyAdminAuth() {
  return adminGraphql<{
    shop: {
      name: string;
      myshopifyDomain: string;
    } | null;
  }>(
    `
      query DebugShopifyAdminAuth {
        shop {
          name
          myshopifyDomain
        }
      }
    `
  );
}
async function findCustomerByQuery(query: string): Promise<ShopifyCustomerNode | null> {
  const data = await adminGraphql<{
    customers: {
      edges: Array<{ node: ShopifyCustomerNode }>;
    };
  }>(
    `
      query FindCustomer($query: String!) {
        customers(first: 1, query: $query) {
          edges {
            node {
              id
              email
              phone
            }
          }
        }
      }
    `,
    { query }
  );

  return data.customers.edges[0]?.node || null;
}

export async function findShopifyCustomerIdByIdentity(
  input: ShopifyCustomerLookupInput
): Promise<string | null> {
  const email = normalizeEmail(input.email);
  const phone = normalizeIndianPhoneToE164(input.phoneE164);

  if (email) {
    const customer = await findCustomerByQuery(`email:${email}`);
    if (customer?.id) {
      return parseCustomerId(customer.id);
    }
  }

  if (phone) {
    const customer = await findCustomerByQuery(`phone:${phone}`);
    if (customer?.id) {
      return parseCustomerId(customer.id);
    }
  }

  return null;
}

async function createCustomer(input: ShopifyCustomerSyncInput) {
  const { firstName, lastName } = splitName(input.fullName);
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phoneE164);

  const data = await adminGraphql<{
    customerCreate: {
      customer?: ShopifyCustomerNode | null;
      userErrors: Array<{ message: string }>;
    };
  }>(
    `
      mutation CreateCustomer($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            phone
          }
          userErrors {
            message
          }
        }
      }
    `,
    {
      input: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        email: email || undefined,
        phone: phone || undefined,
      },
    }
  );

  const errorMessage = data.customerCreate.userErrors[0]?.message;
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  if (!data.customerCreate.customer?.id) {
    throw new Error("Shopify did not return a customer id");
  }

  return data.customerCreate.customer;
}

async function setOrderTags(input: { orderId: string; tags: string[] }) {
  const tags = Array.from(new Set((input.tags || []).map((tag) => String(tag || "").trim()).filter(Boolean)));

  if (!tags.length) {
    return {
      node: {
        id: resolveOrderGid(input.orderId),
        tags: [] as string[],
      },
      userErrors: [] as Array<{ message: string; field?: string[] }>,
    };
  }

  const data = await adminGraphql<{
    tagsAdd: {
      node?: { id: string; tags: string[] } | null;
      userErrors: Array<{ message: string; field?: string[] }>;
    };
  }>(
    `
      mutation AddOrderTags($id: ID!, $tags: [String!]!) {
        tagsAdd(id: $id, tags: $tags) {
          node {
            ... on Order {
              id
              tags
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      id: resolveOrderGid(input.orderId),
      tags,
    }
  );

  return data.tagsAdd;
}

export async function updateOrderPhone(input: { orderId: string; phone: string }) {
  const data = await adminGraphql<{
    orderUpdate: {
      order?: { id: string; phone?: string | null } | null;
      userErrors: Array<{ message: string; field?: string[] }>;
    };
  }>(
    `
      mutation UpdateOrderPhone($input: OrderInput!) {
        orderUpdate(input: $input) {
          order {
            id
            phone
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      input: {
        id: resolveOrderGid(input.orderId),
        phone: String(input.phone || "").trim(),
      },
    }
  );

  return data.orderUpdate;
}

export async function updateShopifyOrderEmail(orderGid: string, email: string) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new Error("Missing order email");
  }

  const data = await adminGraphql<{
    orderUpdate: {
      order?: { id: string; email?: string | null } | null;
      userErrors: Array<{ message: string; field?: string[] }>;
    };
  }>(
    `
      mutation UpdateOrderEmail($input: OrderInput!) {
        orderUpdate(input: $input) {
          order {
            id
            email
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      input: {
        id: resolveOrderGid(orderGid),
        email: normalizedEmail,
      },
    }
  );

  return data.orderUpdate;
}

export async function getShopifyCustomerDashboardData(
  customerId: string
): Promise<ShopifyCustomerDashboardData | null> {
  const customerGid = resolveCustomerGid(customerId);
  if (!customerGid) return null;

  console.log("[SHOPIFY DASHBOARD] fetch customer dashboard", {
    inputCustomerId: customerId,
    customerGid,
  });

  const data = await adminGraphql<{
    customer: {
      email?: string | null;
      phone?: string | null;
      numberOfOrders?: string | number | null;
      defaultAddress?: ShopifyMailingAddress | null;
      orders: {
        nodes: Array<{
          id: string;
          name?: string | null;
          processedAt?: string | null;
          displayFinancialStatus?: string | null;
          displayFulfillmentStatus?: string | null;
          statusPageUrl?: string | null;
          currentTotalPriceSet?: {
            shopMoney?: ShopifyMoney | null;
          } | null;
          lineItems?: {
            nodes?: Array<{
              title?: string | null;
              variant?: {
                image?: {
                  url?: string | null;
                } | null;
              } | null;
            }>;
          } | null;
        }>;
      };
    } | null;
  }>(
    `
      query MegaskaCustomerDashboard($id: ID!) {
        customer(id: $id) {
          email
          phone
          numberOfOrders
          defaultAddress {
            firstName
            lastName
            address1
            address2
            city
            province
            zip
            country
            phone
          }
          orders(first: 5, sortKey: PROCESSED_AT, reverse: true) {
            nodes {
              id
              name
              processedAt
              displayFinancialStatus
              displayFulfillmentStatus
              statusPageUrl
              currentTotalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              lineItems(first: 1) {
                nodes {
                  title
                  variant {
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    { id: customerGid }
  );
  console.log("[SHOPIFY DASHBOARD] raw customer result", {
    customerGid,
    foundCustomer: Boolean(data.customer),
    email: data.customer?.email || null,
    phone: data.customer?.phone || null,
    numberOfOrders: data.customer?.numberOfOrders ?? null,
    recentOrdersCount: data.customer?.orders?.nodes?.length ?? null,
  });

  const customer = data.customer;
  if (!customer) return null;

  const totalOrderCountRaw = customer.numberOfOrders;
  const totalOrderCount =
    typeof totalOrderCountRaw === "number"
      ? totalOrderCountRaw
      : Number.parseInt(String(totalOrderCountRaw || "0"), 10) || 0;

  return {
    email: customer.email || null,
    phone: customer.phone || null,
    defaultAddress: customer.defaultAddress || null,
    totalOrderCount,
    recentOrders: (customer.orders?.nodes || []).map((order) => {
      const firstItem = order.lineItems?.nodes?.[0];
      return {
        id: order.id,
        shopifyOrderId: order.id,
        name: String(order.name || "").trim(),
        processedAt: order.processedAt || null,
        totalAmount: order.currentTotalPriceSet?.shopMoney?.amount || null,
        currencyCode: order.currentTotalPriceSet?.shopMoney?.currencyCode || null,
        financialStatus: order.displayFinancialStatus || null,
        fulfillmentStatus: order.displayFulfillmentStatus || null,
        deliveredAt: order.processedAt || null,
        statusPageUrl: order.statusPageUrl || null,
        displayTitle: String(firstItem?.title || order.name || "Order").trim() || "Order",
        displayImage: firstItem?.variant?.image?.url || null,
        itemsCount: null,
        firstLineItemId: null,
        firstLineItemTitle: String(firstItem?.title || "").trim() || null,
        firstLineItemVariantTitle: null,
        firstLineItemSku: null,
      };
    }),
  };
}

export async function findOrCreateShopifyCustomer(
  input: ShopifyCustomerSyncInput
): Promise<ShopifyCustomerSyncResult> {
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phoneE164);

  if (email) {
    const existingByEmail = await findCustomerByQuery(`email:${email}`);
    if (existingByEmail?.id) {
      return {
        shopifyCustomerId: parseCustomerId(existingByEmail.id),
        source: "existing",
        matchedBy: "email",
      };
    }
  }

  if (phone) {
    const existingByPhone = await findCustomerByQuery(`phone:${phone}`);
    if (existingByPhone?.id) {
      return {
        shopifyCustomerId: parseCustomerId(existingByPhone.id),
        source: "existing",
        matchedBy: "phone",
      };
    }
  }

  const created = await createCustomer({
    fullName: input.fullName,
    email,
    phoneE164: phone,
  });

  return {
    shopifyCustomerId: parseCustomerId(created.id),
    source: "created",
  };
}

export async function setOrderMegaskaIdentityMetafields(input: OrderMegaskaIdentityInput) {
  const ownerId = resolveOrderGid(input.orderId);

  const entries = [
    { key: "verified_phone", value: String(input.verifiedPhone || "").trim() },
    { key: "phone_verified", value: input.phoneVerified ? "true" : "false" },
    { key: "auth_source", value: String(input.authSource || "otp").trim() },
    { key: "customer_profile_id", value: String(input.customerProfileId || "").trim() },
    { key: "shopify_customer_id", value: String(input.shopifyCustomerId || "").trim() },
    {
      key: "verification_completed_at",
      value: String(input.verificationCompletedAt || "").trim(),
    },
    { key: "phone_match_status", value: String(input.phoneMatchStatus || "").trim() },
    { key: "original_checkout_phone", value: String(input.originalCheckoutPhone || "").trim() },
    { key: "corrected_order_phone", value: String(input.correctedOrderPhone || "").trim() },
    {
      key: "phone_corrected",
      value: typeof input.phoneCorrected === "boolean" ? (input.phoneCorrected ? "true" : "false") : "",
    },
    { key: "order_contact_email", value: String(input.orderContactEmail || "").trim() },
    {
      key: "mismatch_detected",
      value: typeof input.mismatchDetected === "boolean" ? (input.mismatchDetected ? "true" : "false") : "",
    },
    {
      key: "correction_attempted",
      value: typeof input.correctionAttempted === "boolean" ? (input.correctionAttempted ? "true" : "false") : "",
    },
    { key: "correction_error", value: String(input.correctionError || "").trim() },
  ].filter((entry) => entry.value);

  const metafields = entries.map((entry) => ({
    ownerId,
    namespace: "megaska",
    key: entry.key,
    type: "single_line_text_field",
    value: entry.value,
  }));

  const data = await adminGraphql<{
    metafieldsSet: {
      metafields: Array<{ id: string; key: string; namespace: string }>;
      userErrors: Array<{ message: string; field?: string[] }>;
    };
  }>(
    `
      mutation SetMegaskaOrderIdentity($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    { metafields }
  );

  const tagsToAdd: string[] = [];
  if (input.phoneMatchStatus === "match") {
    tagsToAdd.push("MEGASKA_PHONE_VERIFIED");
  }
  if (input.mismatchDetected) {
    tagsToAdd.push("MEGASKA_PHONE_MISMATCH");
  }
  if (input.phoneCorrected) {
    tagsToAdd.push("MEGASKA_PHONE_CORRECTED");
  }

  const tagsResult = await setOrderTags({
    orderId: input.orderId,
    tags: tagsToAdd,
  });

  return {
    metafields: data.metafieldsSet.metafields,
    userErrors: [...data.metafieldsSet.userErrors, ...tagsResult.userErrors],
    tags: tagsResult.node?.tags || [],
  };
}


export async function createWalletReservationDiscountCode(input: {
  reservationId: string;
  amountMinor: number;
  currency: string;
  customerProfileId: string;
  endsAt: Date;
}) {
  const amount = (Math.max(0, input.amountMinor) / 100).toFixed(2);
  const code = `MWR-${input.reservationId.slice(0, 8).toUpperCase()}`;
  const startsAt = new Date().toISOString();
  const basicCodeDiscount = {
    title: `Megaska Wallet ${input.reservationId}`,
    code,
    startsAt,
    endsAt: input.endsAt.toISOString(),
    context: {
      all: true,
    },
    customerGets: {
      value: {
        discountAmount: {
          amount,
          appliesOnEachItem: false,
        },
      },
      items: {
        all: true,
      },
    },
    appliesOncePerCustomer: true,
    usageLimit: 1,
    combinesWith: {
      orderDiscounts: true,
      productDiscounts: true,
      shippingDiscounts: false,
    },
  };

  console.log("[SHOPIFY ADMIN] wallet discount create input", {
    reservationId: input.reservationId,
    customerProfileId: input.customerProfileId,
    amountMinor: input.amountMinor,
    currency: input.currency,
    code,
    startsAt,
    endsAt: input.endsAt.toISOString(),
    context: "all",
  });

  const data = await adminGraphql<{
    discountCodeBasicCreate: {
      codeDiscountNode?: { id: string } | null;
      userErrors: Array<{ message: string; field?: string[] }>;
    };
  }>(
    `
      mutation CreateMegaskaWalletDiscount($basicCodeDiscount: DiscountCodeBasicInput!) {
        discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
          codeDiscountNode {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      basicCodeDiscount,
    }
  );

  if (data.discountCodeBasicCreate.userErrors.length) {
    console.error("[SHOPIFY ADMIN] wallet discount create userErrors", {
      reservationId: input.reservationId,
      code,
      userErrors: data.discountCodeBasicCreate.userErrors,
    });
  }

  const error = data.discountCodeBasicCreate.userErrors[0]?.message;
  if (error) throw new Error(error);

  const nodeId = String(data.discountCodeBasicCreate.codeDiscountNode?.id || "").trim();
  if (!nodeId) throw new Error("Shopify wallet discount creation failed");

  console.log("[SHOPIFY ADMIN] wallet discount create success", {
    reservationId: input.reservationId,
    discountNodeId: nodeId,
    code,
  });

  return {
    code,
    discountNodeId: nodeId,
  };
}

export async function disableWalletReservationDiscountCode(discountNodeId: string) {
  const id = String(discountNodeId || "").trim();
  if (!id) return { ok: true, skipped: true };

  const data = await adminGraphql<{
    discountCodeDeactivate: {
      codeDiscountNode?: { id: string } | null;
      userErrors: Array<{ message: string; field?: string[] }>;
    };
  }>(
    `
      mutation DisableMegaskaWalletDiscount($id: ID!) {
        discountCodeDeactivate(id: $id) {
          codeDiscountNode {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    { id }
  );

  if (data.discountCodeDeactivate.userErrors.length) {
    console.error("[SHOPIFY ADMIN] wallet discount deactivate userErrors", {
      discountNodeId: id,
      userErrors: data.discountCodeDeactivate.userErrors,
    });
  }

  const error = data.discountCodeDeactivate.userErrors[0]?.message;
  if (error) throw new Error(error);

  return {
    ok: true,
    id: data.discountCodeDeactivate.codeDiscountNode?.id || id,
  };
}
