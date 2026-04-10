import { Resend } from "resend";

type SendEmailInput = {
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  html: string;
};

type SendEmailContext = {
  requestId?: string;
};

function parseEmails(value: string | undefined) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getResendClient(apiKey: string) {
  return new Resend(apiKey);
}

export function getOpsNotificationConfig() {
  const apiKey = String(process.env.RESEND_API_KEY || "").trim();
  const from = String(process.env.OPS_NOTIFICATION_FROM_EMAIL || "").trim();
  const to = parseEmails(process.env.OPS_NOTIFICATION_TO_EMAIL);
  const cc = parseEmails(process.env.OPS_NOTIFICATION_CC_EMAILS);

  return {
    apiKey,
    from,
    to,
    cc,
    enabled: Boolean(apiKey && from && to.length > 0),
  };
}

export async function sendEmailWithResend(input: SendEmailInput, context: SendEmailContext = {}) {
  const config = getOpsNotificationConfig();
  console.info("[EXCHANGE NOTIFY] Resend config snapshot", {
    hasApiKey: Boolean(config.apiKey),
    fromEmailPresent: Boolean(config.from),
    toEmailPresent: config.to.length > 0,
    requestId: context.requestId || null,
  });

  if (!config.enabled) {
    console.warn("[EXCHANGE NOTIFY] Resend is not fully configured. Skipping email send.", {
      requestId: context.requestId || null,
      from: input.from || null,
      to: input.to,
    });
    return { skipped: true } as const;
  }

  try {
    const resend = getResendClient(config.apiKey);
    const result = await resend.emails.send({
      from: input.from,
      to: input.to,
      cc: input.cc,
      subject: input.subject,
      html: input.html,
    });

    if (result.error) {
      throw new Error(`Resend email failed: ${result.error.message}`);
    }

    console.info("[EXCHANGE NOTIFY] Resend send success", {
      requestId: context.requestId || null,
      resendEmailId: result.data?.id || null,
    });
    return { skipped: false, success: true, resendEmailId: result.data?.id || null } as const;
  } catch (error) {
    console.error("[EXCHANGE NOTIFY] Resend send failed", {
      requestId: context.requestId || null,
      from: input.from || null,
      to: input.to,
      errorName: error instanceof Error ? error.name : null,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : null,
      errorCause: error instanceof Error ? String(error.cause || "") || null : null,
    });
    return {
      skipped: false,
      success: false,
      errorName: error instanceof Error ? error.name : null,
      errorMessage: error instanceof Error ? error.message : String(error),
    } as const;
  }
}
