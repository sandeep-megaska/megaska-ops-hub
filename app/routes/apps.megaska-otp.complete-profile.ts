import type { ActionFunctionArgs } from "react-router";
import { prisma } from "../lib/prisma.server";
import { bindProfileToAuthSession, validateAuthSession } from "../lib/customer-auth.server";

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
    const authToken = String(body.authToken || "").trim();
    const firstName = String(body.firstName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const marketingOptIn = Boolean(body.marketingOptIn);

    if (!firstName) {
      return json({ success: false, error: "First name is required" }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ success: false, error: "Valid email is required" }, { status: 400 });
    }

    const validation = await validateAuthSession(authToken);
    if (!validation.ok || !validation.session) {
      return json({ success: false, error: "Unauthorized", reason: validation.reason }, { status: 401 });
    }

    const phoneE164 = validation.session.phoneE164;

    let profile = await prisma.megaskaCustomerProfile.findUnique({ where: { phoneE164 } });

    if (!profile) {
      profile = await prisma.megaskaCustomerProfile.create({
        data: {
          phoneE164,
          firstName,
          email,
          marketingOptIn,
        },
      });
    } else {
      profile = await prisma.megaskaCustomerProfile.update({
        where: { id: profile.id },
        data: {
          firstName: profile.firstName || firstName,
          email: profile.email || email,
          marketingOptIn,
        },
      });
    }

    await bindProfileToAuthSession({
      authToken,
      customerProfileId: profile.id,
    });

    return json({
      success: true,
      profileCompleted: true,
      profile: {
        id: profile.id,
        firstName: profile.firstName,
        email: profile.email,
        phone: profile.phoneE164,
      },
    });
  } catch {
    return json({ success: false, error: "Failed to complete profile" }, { status: 500 });
  }
}
