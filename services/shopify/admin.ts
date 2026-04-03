const SHOPIFY_API_VERSION = "2026-01";

type ShopifyCustomerNode = {
  id: string;
  email?: string | null;
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

export type OrderMegaskaIdentityInput = {
  orderId: string;
  verifiedPhone: string;
  phoneVerified: boolean;
  authSource: string;
  customerProfileId?: string | null;
  shopifyCustomerId?: string | null;
  verificationCompletedAt?: string | null;
  phoneMatchStatus?: "match" | "mismatch" | "missing_checkout_phone" | "missing_verified_phone";
  checkoutContactPhone?: string | null;
  checkoutContactEmail?: string | null;
  mismatchDetected?: boolean;
};

function getShopDomain() {
  return (process.env.SHOPIFY_STORE_DOMAIN || "").trim();
}

function getAdminAccessToken() {
  return (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "").trim();
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

async function adminGraphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const shopDomain = getShopDomain();
  const token = getAdminAccessToken();

  if (!shopDomain || !token) {
    throw new Error("Shopify admin sync is not configured");
  }

  const response = await fetch(`https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables: variables || {} }),
  });

  if (!response.ok) {
    throw new Error(`Shopify admin request failed (${response.status})`);
  }

  const payload = (await response.json()) as {
    data?: T;
    errors?: Array<{ message?: string }>;
  };

  if (payload.errors?.length) {
    const message = payload.errors.map((error) => error.message).filter(Boolean).join(", ");
    throw new Error(message || "Shopify admin GraphQL error");
  }

  if (!payload.data) {
    throw new Error("Shopify admin response missing data");
  }

  return payload.data;
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
      userErrors: [] as Array<{ message: string; field?: string[] }> ,
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

export function isShopifyAdminConfigured() {
  return Boolean(getShopDomain() && getAdminAccessToken());
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
    { key: "checkout_contact_phone", value: String(input.checkoutContactPhone || "").trim() },
    { key: "checkout_contact_email", value: String(input.checkoutContactEmail || "").trim() },
    {
      key: "mismatch_detected",
      value: typeof input.mismatchDetected === "boolean" ? (input.mismatchDetected ? "true" : "false") : "",
    },
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

  const tagsToAdd = ["MEGASKA_PHONE_VERIFIED"];
  if (input.mismatchDetected) {
    tagsToAdd.push("MEGASKA_PHONE_MISMATCH");
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
