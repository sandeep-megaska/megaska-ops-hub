type SendEmailInput = {
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  html: string;
};

function parseEmails(value: string | undefined) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
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

export async function sendEmailWithResend(input: SendEmailInput) {
  const config = getOpsNotificationConfig();
  if (!config.enabled) {
    console.warn("[EXCHANGE NOTIFY] Resend is not fully configured. Skipping email send.");
    return { skipped: true } as const;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: input.from,
      to: input.to,
      cc: input.cc,
      subject: input.subject,
      html: input.html,
    }),
  });

  if (!response.ok) {
    const failure = await response.text().catch(() => "");
    throw new Error(`Resend email failed (${response.status}) ${failure}`.trim());
  }

  return { skipped: false } as const;
}
