export async function sendAdminAlert(subject, text) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_ALERT_EMAIL;
  const from =
    process.env.ALERT_FROM_EMAIL || "Megaska Ops Hub <noreply@megaska.com>";

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  if (!to) {
    throw new Error("Missing ADMIN_ALERT_EMAIL");
  }

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text,
    }),
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Resend failed: ${resp.status} ${body}`);
  }

  return await resp.json();
}