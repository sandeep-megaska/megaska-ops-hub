import type { ActionFunctionArgs } from "react-router";
import {
  destroyCustomerSession,
  getCustomerSession,
} from "../lib/customer-session.server";

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
  const session = await getCustomerSession(request);

  return json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": await destroyCustomerSession(session),
      },
    },
  );
}