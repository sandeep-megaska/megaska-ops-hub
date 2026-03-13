import type { LoaderFunctionArgs } from "react-router";
import { prisma } from "../lib/prisma.server";
import { getCustomerSession } from "../lib/customer-session.server";

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getCustomerSession(request);
  const customerProfileId = session.get("customerProfileId");
  const verifiedPhone = Boolean(session.get("verifiedPhone"));
  const phoneE164 = session.get("phoneE164") || null;

  if (!customerProfileId) {
    return json({
      ok: true,
      authenticated: false,
      verifiedPhone,
      phoneE164,
    });
  }

  const profile = await prisma.megaskaCustomerProfile.findUnique({
    where: { id: customerProfileId },
    select: {
      id: true,
      phoneE164: true,
      email: true,
      firstName: true,
      lastName: true,
      shopifyCustomerId: true,
    },
  });

  if (!profile) {
    return json({
      ok: true,
      authenticated: false,
      verifiedPhone,
      phoneE164,
    });
  }

  return json({
    ok: true,
    authenticated: true,
    verifiedPhone,
    profile,
  });
}