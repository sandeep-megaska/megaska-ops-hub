import type { ActionFunctionArgs } from "react-router";
import {
  commitCustomerSession,
  getCustomerSession,
} from "../lib/customer-session.server";
import { sendOtp } from "../lib/twilio.server";

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
    const phoneE164 = String(body.phoneE164 || "").trim();
    const intent = body.intent === "account" ? "account" : body.intent === "page" ? "page" : "checkout";
    const returnUrl = typeof body.returnUrl === "string" ? body.returnUrl : "/";

    if (!/^\+[1-9]\d{7,14}$/.test(phoneE164)) {
      return json({ ok: false, error: "Invalid phone number" }, { status: 400 });
    }

    await sendOtp(phoneE164);

    const session = await getCustomerSession(request);
session.unset("customerProfileId");
session.set("phoneE164", phoneE164);
session.set("verifiedPhone", false);
session.set("postLoginIntent", intent);
session.set("postLoginRedirect", returnUrl);

    return json(
      { ok: true },
      {
        headers: {
          "Set-Cookie": await commitCustomerSession(session),
        },
      },
    );
  } catch (error) {
    return json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to request OTP" },
      { status: 500 },
    );
  }
}