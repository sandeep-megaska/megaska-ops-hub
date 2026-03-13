import { Page, Card, Text, Banner } from "@shopify/polaris";
import { useLoaderData } from "react-router";
import { sendAdminAlert } from "../email.server";

export async function loader() {
  const now = new Date().toISOString();

  try {
    await sendAdminAlert(
      "Megaska Ops Hub Test Email",
      [
        "This is a test email from Megaska Ops Hub.",
        "",
        `Sent at: ${now}`,
        "",
        "If you received this, Resend is working correctly in the new app.",
      ].join("\n")
    );

    return Response.json({
      ok: true,
      message: "Test email sent successfully.",
    });
  } catch (err) {
    console.error("SEND_TEST_EMAIL_ERROR", err);

    return Response.json({
      ok: false,
      error: err?.message || "Failed to send test email",
    });
  }
}

export default function EmailTestPage() {
  const data = useLoaderData();

  return (
    <Page title="Email Test">
      <Card>
        <div style={{ padding: 16 }}>
          {data.ok ? (
            <Banner tone="success">
              <p>{data.message}</p>
            </Banner>
          ) : (
            <Banner tone="critical">
              <p>{data.error}</p>
            </Banner>
          )}

          <div style={{ marginTop: 12 }}>
            <Text as="p" tone="subdued">
              This route sends a test email on page load.
            </Text>
          </div>
        </div>
      </Card>
    </Page>
  );
}