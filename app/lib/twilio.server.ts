import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

// Optional tuning knobs for later deployed environments.
// Safe defaults are provided for local dev.
const twilioRegion = process.env.TWILIO_REGION || undefined;
const twilioEdge = process.env.TWILIO_EDGE || undefined;

if (!accountSid || !authToken || !verifyServiceSid) {
  throw new Error("Twilio env vars are missing");
}

const client = twilio(accountSid, authToken, {
  keepAlive: true,
  lazyLoading: true,
  ...(twilioRegion ? { region: twilioRegion } : {}),
  ...(twilioEdge ? { edge: twilioEdge } : {}),
});

export async function sendOtp(phoneE164: string) {
  const startedAt = Date.now();

  try {
    console.log("[twilio.sendOtp] start", { phoneE164 });

    const result = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: phoneE164,
        channel: "sms",
      });

    console.log("[twilio.sendOtp] success", {
      phoneE164,
      sid: result.sid,
      status: result.status,
      durationMs: Date.now() - startedAt,
    });

    return result;
  } catch (error) {
    console.error("[twilio.sendOtp] failed", {
      phoneE164,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export async function checkOtp(phoneE164: string, code: string) {
  const startedAt = Date.now();

  try {
    console.log("[twilio.checkOtp] start", { phoneE164 });

    const result = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: phoneE164,
        code,
      });

    console.log("[twilio.checkOtp] success", {
      phoneE164,
      status: result.status,
      valid: result.valid,
      durationMs: Date.now() - startedAt,
    });

    return result;
  } catch (error) {
    console.error("[twilio.checkOtp] failed", {
      phoneE164,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}