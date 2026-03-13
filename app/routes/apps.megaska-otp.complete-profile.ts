import type { ActionFunctionArgs } from "react-router";
import { prisma } from "../lib/prisma.server";
import {
  commitCustomerSession,
  getCustomerSession,
} from "../lib/customer-session.server";

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();
    const firstName = String(body.firstName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phoneE164 = String(body.phoneE164 || "").trim();
    const lastName = body.lastName ? String(body.lastName).trim() : null;
    const marketingOptIn = Boolean(body.marketingOptIn);

    if (!firstName) {
      return json({ ok: false, error: "First name is required" }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: "Valid email is required" }, { status: 400 });
    }

    if (!/^\+[1-9]\d{7,14}$/.test(phoneE164)) {
      return json({ ok: false, error: "Invalid phone number" }, { status: 400 });
    }

    const session = await getCustomerSession(request);

    let profile = await prisma.megaskaCustomerProfile.findUnique({
      where: { phoneE164 },
    });

    if (!profile) {
      profile = await prisma.megaskaCustomerProfile.create({
        data: {
          phoneE164,
          email,
          firstName,
          lastName,
          marketingOptIn,
        },
      });
    } else {
      profile = await prisma.megaskaCustomerProfile.update({
        where: { id: profile.id },
        data: {
          email,
          firstName,
          lastName,
          marketingOptIn,
        },
      });
    }

    session.set("verifiedPhone", true);
    session.set("phoneE164", phoneE164);
    session.set("customerProfileId", profile.id);

    const redirectTo = session.get("postLoginRedirect") || "/";

    return json(
      {
        ok: true,
        status: "profile_completed",
        redirectTo,
      },
      {
        headers: {
          "Set-Cookie": await commitCustomerSession(session),
        },
      },
    );
  } catch (error) {
    return json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to complete profile",
      },
      { status: 500 },
    );
  }
}
