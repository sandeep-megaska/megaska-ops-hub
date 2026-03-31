import type { ActionFunctionArgs } from "react-router";
import { checkOtp } from "../lib/twilio.server";
import { createAuthSession, findActiveProfileByPhone } from "../lib/customer-auth.server";

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}

function normalizeIndiaPhoneE164(raw: string) {
  const cleaned = raw.trim().replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) {
    if (!/^\+[1-9]\d{7,14}$/.test(cleaned)) {
      return null;
    }
    return cleaned;
  }

  const digits = cleaned.replace(/\D/g, "");
  if (/^91\d{10}$/.test(digits)) {
    return `+${digits}`;
  }
  if (/^\d{10}$/.test(digits)) {
    return `+91${digits}`;
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();
    const otp = String(body.otp || "").trim();
    const rawPhone = String(body.phoneE164 || body.phone || "");
    const phoneE164 = normalizeIndiaPhoneE164(rawPhone);

    if (!/^\d{4,10}$/.test(otp)) {
      return json({ success: false, error: "Invalid OTP" }, { status: 400 });
    }

    if (!phoneE164) {
      return json({ success: false, error: "Invalid phone number" }, { status: 400 });
    }

    const result = await checkOtp(phoneE164, otp);

    if (result.status !== "approved") {
      return json({ success: false, error: "Invalid OTP" }, { status: 401 });
    }

    const profile = await findActiveProfileByPhone(phoneE164);
    const { authToken } = await createAuthSession({
      phoneE164,
      customerProfileId: profile?.id ?? null,
    });

    return json({
      success: true,
      authToken,
      hasProfile: Boolean(profile),
      profileCompleted: Boolean(profile),
      profile: profile
        ? {
            id: profile.id,
            firstName: profile.firstName,
            email: profile.email,
            phone: profile.phoneE164,
          }
        : null,
    });
  } catch {
    return json({ success: false, error: "Failed to verify OTP" }, { status: 500 });
  }
}
