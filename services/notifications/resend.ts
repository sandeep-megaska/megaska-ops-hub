function parseRecipients(value: string | undefined) {
  return String(value || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function getAdminEmailConfig() {
  const apiKey = String(process.env.RESEND_API_KEY || "").trim();
  const from = String(process.env.OPS_NOTIFICATION_FROM_EMAIL || "").trim();
  const to = parseRecipients(process.env.ADMIN_ALERT_EMAIL || process.env.OPS_NOTIFICATION_TO_EMAIL);

  return {
    apiKey,
    from,
    to,
    enabled: Boolean(apiKey && from && to.length > 0),
  };
}

export async function sendAdminAlert(subject: string, text: string) {
  const config = getAdminEmailConfig();
  if (!config.enabled) {
    console.warn("[EXCHANGE NOTIFY] Email config missing, skipping admin alert", {
      hasApiKey: Boolean(config.apiKey),
      hasFrom: Boolean(config.from),
      recipientCount: config.to.length,
      subject,
    });
    return { skipped: true } as const;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: config.to,
        subject,
        text,
      }),
    });

    const data = (await response.json().catch(() => null)) as { id?: string; message?: string } | null;

    if (!response.ok) {
      throw new Error(data?.message || `Resend HTTP ${response.status}`);
    }

    return { skipped: false, success: true, messageId: data?.id || null } as const;
  } catch (error) {
    console.error("[EXCHANGE NOTIFY] Admin alert send failed", {
      subject,
      errorName: error instanceof Error ? error.name : null,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : null,
    });
    return { skipped: false, success: false } as const;
  }
}
