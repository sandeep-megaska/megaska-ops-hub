type ShopifyAdminLike = {
  graphql: (
    query: string,
    options?: { variables?: Record<string, unknown> },
  ) => Promise<Response>;
};

type ShopifyCustomerInput = {
  phoneE164: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  marketingOptIn?: boolean;
};

async function shopifyGraphql<T>(
  admin: ShopifyAdminLike,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await admin.graphql(query, { variables });
  const json = await response.json();

  if (!response.ok || json.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors || json)}`);
  }

  return json.data as T;
}

export async function findShopifyCustomerByPhone(
  admin: ShopifyAdminLike,
  phoneE164: string,
) {
  const query = `
    query FindCustomerByPhone($query: String!) {
      customers(first: 1, query: $query) {
        edges {
          node {
            id
            firstName
            lastName
            email
            phone
          }
        }
      }
    }
  `;

  const data = await shopifyGraphql<{
    customers: {
      edges: Array<{
        node: {
          id: string;
          firstName: string | null;
          lastName: string | null;
          email: string | null;
          phone: string | null;
        };
      }>;
    };
  }>(admin, query, { query: `phone:${phoneE164}` });

  return data.customers.edges[0]?.node ?? null;
}

export async function createShopifyCustomer(
  admin: ShopifyAdminLike,
  input: ShopifyCustomerInput,
) {
  const mutation = `
    mutation CreateCustomer($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
          phone
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphql<{
    customerCreate: {
      customer: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
      } | null;
      userErrors: Array<{ field: string[] | null; message: string }>;
    };
  }>(admin, mutation, {
    input: {
      firstName: input.firstName || undefined,
      lastName: input.lastName || undefined,
      email: input.email || undefined,
      phone: input.phoneE164,
      smsMarketingConsent: input.marketingOptIn
        ? {
            marketingState: "SUBSCRIBED",
            marketingOptInLevel: "SINGLE_OPT_IN",
          }
        : undefined,
    },
  });

  if (data.customerCreate.userErrors.length > 0) {
    throw new Error(
      `Shopify customerCreate errors: ${JSON.stringify(data.customerCreate.userErrors)}`,
    );
  }

  if (!data.customerCreate.customer) {
    throw new Error("Shopify customerCreate returned no customer");
  }

  return data.customerCreate.customer;
}

export async function updateShopifyCustomer(
  admin: ShopifyAdminLike,
  shopifyCustomerId: string,
  input: ShopifyCustomerInput,
) {
  const mutation = `
    mutation UpdateCustomer($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
          phone
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphql<{
    customerUpdate: {
      customer: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
      } | null;
      userErrors: Array<{ field: string[] | null; message: string }>;
    };
  }>(admin, mutation, {
    input: {
      id: shopifyCustomerId,
      firstName: input.firstName || undefined,
      lastName: input.lastName || undefined,
      email: input.email || undefined,
      phone: input.phoneE164,
      smsMarketingConsent: input.marketingOptIn
        ? {
            marketingState: "SUBSCRIBED",
            marketingOptInLevel: "SINGLE_OPT_IN",
          }
        : undefined,
    },
  });

  if (data.customerUpdate.userErrors.length > 0) {
    throw new Error(
      `Shopify customerUpdate errors: ${JSON.stringify(data.customerUpdate.userErrors)}`,
    );
  }

  if (!data.customerUpdate.customer) {
    throw new Error("Shopify customerUpdate returned no customer");
  }

  return data.customerUpdate.customer;
}

export async function findOrCreateShopifyCustomer(
  admin: ShopifyAdminLike,
  input: ShopifyCustomerInput,
) {
  const existing = await findShopifyCustomerByPhone(admin, input.phoneE164);

  if (existing) {
    return existing;
  }

  return createShopifyCustomer(admin, input);
}