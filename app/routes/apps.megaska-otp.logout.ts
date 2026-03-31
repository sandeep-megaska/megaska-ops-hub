import type { ActionFunctionArgs } from "react-router";
import { revokeAuthSession } from "../lib/customer-auth.server";

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();
    const authToken = String(body.authToken || "").trim();
    await revokeAuthSession(authToken);
    return json({ success: true });
  } catch {
    return json({ success: false, error: "Failed to logout" }, { status: 500 });
  }
}
