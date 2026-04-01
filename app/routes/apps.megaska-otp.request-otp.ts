import type { ActionFunctionArgs } from "react-router";
import { sendOtp } from "../lib/twilio.server";

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...(init?.headers || {}),
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const startedAt = Date.now();

  try {
    const body = await request.json();
    const phoneE164 = String(body.phoneE164 || "").trim();
    const intent =
      body.intent === "account"
        ? "account"
        : body.intent === "page"
          ? "page"
          : "checkout";
    const returnUrl =
      typeof body.returnUrl === "string" ? body.returnUrl : "/";

    console.log("[request-otp] start", {
      phoneE164,
      intent,
      returnUrl,
      startedAt,
    });

    if (!/^\+[1-9]\d{7,14}$/.test(phoneE164)) {
      console.warn("[request-otp] invalid_phone", { phoneE164 });
      return json(
        { ok: false, error: "Invalid phone number" },
        { status: 400 },
      );
    }

    console.log("[request-otp] twilio_send_start", { phoneE164 });

    await sendOtp(phoneE164);

    console.log("[request-otp] twilio_send_success", {
      phoneE164,
      durationMs: Date.now() - startedAt,
    });

    return json({
      ok: true,
      message: "OTP requested successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to request OTP";

    console.error("[request-otp] failed", {
      durationMs: Date.now() - startedAt,
      error: message,
    });

    return json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}