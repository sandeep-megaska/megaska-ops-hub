export type OtpProvider = "twilio" | "mock";

type TwilioVerifyStartResult = {
  sid: string;
  status: string;
};

type TwilioVerifyCheckResult = {
  sid: string;
  status: string;
  valid: boolean;
};

const TWILIO_VERIFY_API_BASE = "https://verify.twilio.com/v2";

function getTwilioConfig() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim() || "";
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim() || "";
  const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID?.trim() || "";

  return {
    accountSid,
    authToken,
    verifyServiceSid,
    configured: Boolean(accountSid && authToken && verifyServiceSid),
  };
}

export function getOtpProvider(): OtpProvider {
  const { configured } = getTwilioConfig();

  if (configured) {
    return "twilio";
  }

  console.warn("[OTP PROVIDER] Twilio env not fully configured, falling back to mock provider");
  return "mock";
}

async function parseTwilioError(response: Response) {
  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const payloadRecord = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : null;
  const message =
    (typeof payloadRecord?.message === "string" && payloadRecord.message) ||
    (typeof payloadRecord?.detail === "string" && payloadRecord.detail) ||
    `Twilio Verify request failed (${response.status})`;

  const code = typeof payloadRecord?.code === "number" ? payloadRecord.code : response.status;

  return { message, code, payload: payloadRecord };
}

export async function sendOtpWithTwilioVerify(phoneE164: string): Promise<TwilioVerifyStartResult> {
  const { accountSid, authToken, verifyServiceSid, configured } = getTwilioConfig();

  if (!configured) {
    throw new Error("Twilio Verify is not configured");
  }

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const body = new URLSearchParams({
    To: phoneE164,
    Channel: "sms",
  });

  const response = await fetch(
    `${TWILIO_VERIFY_API_BASE}/Services/${verifyServiceSid}/Verifications`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const twilioError = await parseTwilioError(response);
    throw new Error(twilioError.message);
  }

  const result = (await response.json()) as Record<string, unknown>;

  return {
    sid: String(result.sid ?? ""),
    status: String(result.status ?? "pending"),
  };
}

export async function verifyOtpWithTwilioVerify(phoneE164: string, otpCode: string): Promise<TwilioVerifyCheckResult> {
  const { accountSid, authToken, verifyServiceSid, configured } = getTwilioConfig();

  if (!configured) {
    throw new Error("Twilio Verify is not configured");
  }

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const body = new URLSearchParams({
    To: phoneE164,
    Code: otpCode,
  });

  const response = await fetch(
    `${TWILIO_VERIFY_API_BASE}/Services/${verifyServiceSid}/VerificationCheck`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const twilioError = await parseTwilioError(response);
    throw new Error(twilioError.message);
  }

  const result = (await response.json()) as Record<string, unknown>;

  return {
    sid: String(result.sid ?? ""),
    status: String(result.status ?? "pending"),
    valid: Boolean(result.valid),
  };
}

export function normalizeIndianPhone(input: string) {
  const digits = input.replace(/\D/g, "");

  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (input.startsWith("+91") && digits.length === 12) return `+${digits}`;

  return null;
}
