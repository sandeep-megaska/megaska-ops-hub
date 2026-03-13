import { useLoaderData } from "react-router";
import { Page, Card, DataTable, Badge, Button, InlineStack, Text } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("ops_requests")
    .select("*")
    .eq("shop_domain", shopDomain)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(`Failed to load ops_requests: ${error.message}`);
  }

  return Response.json({
    shopDomain,
    rows: data ?? [],
  });
}

const STATUS_TONE = {
  NEW: "info",
  IN_PROGRESS: "warning",
  DONE: "success",
  REJECTED: "critical",
};

export default function OpsInboxPage() {
  const { rows, shopDomain } = useLoaderData();

  const tableRows = rows.map((r) => [
    r.request_no || r.id?.slice(0, 8) || "—",
    r.request_type || "—",
    <Badge key={`${r.id}-status`} tone={STATUS_TONE[r.status] || "info"}>
      {r.status || "NEW"}
    </Badge>,
    r.order_name || "—",
    r.customer_name || "—",
    r.created_at ? new Date(r.created_at).toLocaleString() : "—",
    <InlineStack key={`${r.id}-actions`} gap="200">
      <Button size="slim">View</Button>
      <Button size="slim" variant="primary">
        Start
      </Button>
    </InlineStack>,
  ]);

  return (
    <Page
      title="Ops Inbox"
      subtitle={`Track exchange, defect, and refund requests for ${shopDomain}`}
    >
      <Card>
        <div style={{ padding: 16 }}>
          <Text as="p" tone="subdued">
            {rows.length} requests
          </Text>
        </div>

        <DataTable
          columnContentTypes={["text", "text", "text", "text", "text", "text", "text"]}
          headings={["Request", "Type", "Status", "Order", "Customer", "Created", "Actions"]}
          rows={tableRows}
        />
      </Card>
    </Page>
  );
}