import type { ActionFunctionArgs } from "react-router";
import { prisma } from "../lib/prisma.server";
import {
  commitCustomerSession,
  getCustomerSession,
} from "../lib/customer-session.server";
import { checkOtp } from "../lib/twilio.server";

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
    const otp = String(body.otp || "").trim();
    const phoneE164 = String(body.phoneE164 || "").trim();

    if (!/^\d{4,10}$/.test(otp)) {
      return json({ ok: false, error: "Invalid OTP" }, { status: 400 });
    }

    if (!/^\+[1-9]\d{7,14}$/.test(phoneE164)) {
      return json({ ok: false, error: "Invalid phone number" }, { status: 400 });
    }

    const result = await checkOtp(phoneE164, otp);

    if (result.status !== "approved") {
      return json({ ok: false, error: "OTP verification failed" }, { status: 401 });
    }

    const session = await getCustomerSession(request);
    const profile = await prisma.megaskaCustomerProfile.findUnique({
      where: { phoneE164 },
    });

    session.set("verifiedPhone", true);
    session.set("phoneE164", phoneE164);
    session.unset("customerProfileId");

    if (profile) {
      session.set("customerProfileId", profile.id);

      const redirectTo = session.get("postLoginRedirect") || "/";

      return json(
        {
          ok: true,
          status: "existing_customer",
          profileComplete: Boolean(profile.firstName && profile.email),
          redirectTo,
        },
        {
          headers: {
            "Set-Cookie": await commitCustomerSession(session),
          },
        },
      );
    }

    return json(
      {
        ok: true,
        status: "new_customer",
      },
      {
        headers: {
          "Set-Cookie": await commitCustomerSession(session),
        },
      },
    );
  } catch (error) {
    return json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to verify OTP" },
      { status: 500 },
    );
  }
}
