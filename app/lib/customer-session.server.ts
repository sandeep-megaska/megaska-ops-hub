import { createCookieSessionStorage } from "react-router";

type CustomerSessionData = {
  phoneE164?: string;
  customerProfileId?: string;
  verifiedPhone?: boolean;
  postLoginRedirect?: string;
  postLoginIntent?: "checkout" | "account" | "page";
};

const secret = process.env.MEGASKA_CUSTOMER_SESSION_SECRET;

if (!secret) {
  throw new Error("MEGASKA_CUSTOMER_SESSION_SECRET is required");
}

export const customerSessionStorage = createCookieSessionStorage<CustomerSessionData>({
  cookie: {
    name: "megaska_customer_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    secrets: [secret],
    maxAge: 60 * 60 * 24 * 30,
  },
});

export async function getCustomerSession(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  return customerSessionStorage.getSession(cookieHeader);
}

export async function commitCustomerSession(session: Awaited<ReturnType<typeof getCustomerSession>>) {
  return customerSessionStorage.commitSession(session);
}

export async function destroyCustomerSession(session: Awaited<ReturnType<typeof getCustomerSession>>) {
  return customerSessionStorage.destroySession(session);
}