import { normalizeIndianPhone as normalizeIndianPhoneE164 } from "../phone";

export type OtpProvider = "msg91" | "mock";

type Msg91SendResult = {
  status: string;
  message: string;
};

type Msg91VerifyResult = {
  status: string;
  valid: boolean;
  message: string;
};

const MSG91_OTP_API_BASE = "https://control.msg91.com/api/v5/otp";

function getMsg91Config() {
  const authKey = process.env.MSG91_AUTH_KEY?.trim() || "";
  const templateId = process.env.MSG91_TEMPLATE_ID?.trim() || "";
  const hasAuthKey = Boolean(authKey);
  const hasTemplateId = Boolean(templateId);
  const configured = Boolean(authKey && templateId);

  console.info("[OTP PROVIDER] MSG91 env presence", {
    hasAuthKey,
    hasTemplateId,
    configured,
  });

  return {
    authKey,
    templateId,
    configured,
  };
}

export function getOtpProvider(): OtpProvider {
  const { configured } = getMsg91Config();

  if (configured) {
    return "msg91";
  }

  console.warn("[OTP PROVIDER] MSG91 env not fully configured, falling back to mock provider");
  return "mock";
}

function getMsg91Mobile(phoneE164: string) {
  return phoneE164.replace(/\D/g, "").replace(/^\+/, "");
}

async function parseMsg91Response(response: Response) {
  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const payloadRecord = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : null;
  const message = [
    typeof payloadRecord?.message === "string" ? payloadRecord.message : "",
    typeof payloadRecord?.detail === "string" ? payloadRecord.detail : "",
    typeof payloadRecord?.error === "string" ? payloadRecord.error : "",
  ].find(Boolean) || `MSG91 OTP request failed (${response.status})`;

  const code = typeof payloadRecord?.code === "number" ? payloadRecord.code : response.status;

  return { message, code, payload: payloadRecord };
}

export async function sendOtpWithMsg91(phoneE164: string): Promise<Msg91SendResult> {
  const { authKey, templateId, configured } = getMsg91Config();

  if (!configured) {
    throw new Error("MSG91 OTP provider is not configured");
  }

  const mobile = getMsg91Mobile(phoneE164);
  const params = new URLSearchParams({
    authkey: authKey,
    mobile,
    template_id: templateId,
  });

  const response = await fetch(`${MSG91_OTP_API_BASE}?${params.toString()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: "{}",
    cache: "no-store",
  });

  console.info("[OTP MSG91 SEND REQUEST ACCEPTED]", {
    endpoint: MSG91_OTP_API_BASE,
    method: "POST",
    mobile,
    templateId,
  });

  const msg91Response = await parseMsg91Response(response);

  console.info("[OTP MSG91 SEND RESPONSE BODY]", {
    status: response.status,
    ok: response.ok,
    body: msg91Response.payload,
  });

  if (!response.ok) {
    throw new Error(msg91Response.message);
  }

  return {
    status: "pending",
    message: msg91Response.message,
  };
}

export async function verifyOtpWithMsg91(phoneE164: string, otpCode: string): Promise<Msg91VerifyResult> {
  const { authKey, configured } = getMsg91Config();

  if (!configured) {
    throw new Error("MSG91 OTP provider is not configured");
  }

  const mobile = getMsg91Mobile(phoneE164);
  const params = new URLSearchParams({
    mobile,
    otp: otpCode,
  });

  const response = await fetch(`${MSG91_OTP_API_BASE}/verify?${params.toString()}`, {
    method: "GET",
    headers: {
      authkey: authKey,
    },
    cache: "no-store",
  });

  const msg91Response = await parseMsg91Response(response);

  console.info("[OTP MSG91 VERIFY RESPONSE BODY]", {
    status: response.status,
    ok: response.ok,
    body: msg91Response.payload,
  });

  return {
    status: response.ok ? "approved" : "failed",
    valid: response.ok,
    message: msg91Response.message,
  };
}

export function normalizeIndianPhone(input: string) {
  return normalizeIndianPhoneE164(input);
}
