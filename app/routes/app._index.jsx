import { Page, Layout, Card, Text } from "@shopify/polaris";

export default function AppIndex() {
  return (
    <Page title="Megaska Ops Hub">
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: 20 }}>
              <Text variant="headingLg" as="h2">
                Megaska Operations Hub
              </Text>

              <p style={{ marginTop: 10 }}>
                Central control panel for Megaska operations.
              </p>

              <ul style={{ marginTop: 20 }}>
                <li>Customer OTP Login System</li>
                <li>Wallet Credit System</li>
                <li>Exchange / Return Manager</li>
                <li>Order Support Tools</li>
                <li>Customer Intelligence</li>
              </ul>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
/*import { useFetcher, useLoaderData } from "react-router";
import { Page, Card, Button, Text, InlineStack, Banner } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { sendAdminAlert } from "../email.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);

  return Response.json({
    shop: session.shop,
  });
}

export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent !== "send-test-email") {
    return Response.json(
      { ok: false, error: "Invalid action" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();

  try {
    await sendAdminAlert(
      `Megaska Ops Hub Test Email — ${session.shop}`,
      [
        "This is a test email from Megaska Ops Hub.",
        "",
        `Shop: ${session.shop}`,
        `Sent at: ${now}`,
        "",
        "If you received this, Resend is working correctly in the new app.",
      ].join("\n")
    );

    return Response.json({
      ok: true,
      message: `Test email sent successfully for ${session.shop}`,
    });
  } catch (err) {
    console.error("SEND_TEST_EMAIL_ERROR", err);

    return Response.json(
      {
        ok: false,
        error: err?.message || "Failed to send test email",
      },
      { status: 500 }
    );
  }
}

export default function DashboardPage() {
  const { shop } = useLoaderData();
  const fetcher = useFetcher();

  const isSubmitting = fetcher.state !== "idle";
  const result = fetcher.data;

  return (
    <Page title="Megaska Ops Hub" subtitle={`Admin tools for ${shop}`}>
      <Card>
        <div style={{ padding: 16 }}>
          <InlineStack gap="300" align="space-between" blockAlign="center">
            <Text as="h2" variant="headingMd">
              Email Notification Test
            </Text>

            <fetcher.Form method="post">
              <input type="hidden" name="intent" value="send-test-email" />
              <Button submit variant="primary" loading={isSubmitting}>
                Send Test Email
              </Button>
            </fetcher.Form>
          </InlineStack>

          <div style={{ marginTop: 12 }}>
            <Text as="p" tone="subdued">
              This sends a test email using Resend to the configured admin alert email.
            </Text>
          </div>

          {result?.ok ? (
            <div style={{ marginTop: 16 }}>
              <Banner tone="success">
                <p>{result.message}</p>
              </Banner>
            </div>
          ) : null}

          {result?.ok === false ? (
            <div style={{ marginTop: 16 }}>
              <Banner tone="critical">
                <p>{result.error}</p>
              </Banner>
            </div>
          ) : null}
        </div>
      </Card>
    </Page>
  );
}
  */