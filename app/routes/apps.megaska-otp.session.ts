import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { touchAuthSession, validateAuthSession } from "../lib/customer-auth.server";

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}

function getTokenFromAuthHeader(request: Request): string {
  const authHeader = request.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return "";
  }
  return authHeader.slice("Bearer ".length).trim();
}

async function parseTokenFromRequest(request: Request): Promise<string> {
  const tokenFromHeader = getTokenFromAuthHeader(request);
  if (tokenFromHeader) {
    return tokenFromHeader;
  }

  const url = new URL(request.url);
  const queryToken = (url.searchParams.get("authToken") || "").trim();
  if (queryToken) {
    return queryToken;
  }

  if (request.method !== "GET") {
    try {
      const body = await request.json();
      return String(body.authToken || "").trim();
    } catch {
      return "";
    }
  }

  return "";
}

async function buildSessionResponse(request: Request) {
  const authToken = await parseTokenFromRequest(request);
  const validation = await validateAuthSession(authToken);

  if (!validation.ok || !validation.session) {
    return json({ authenticated: false, reason: validation.reason || "not_found" });
  }

  await touchAuthSession(authToken);

  const profile = validation.session.customerProfile;
  return json({
    authenticated: true,
    profileCompleted: Boolean(profile),
    profile: profile
      ? {
          id: profile.id,
          firstName: profile.firstName,
          email: profile.email,
          phone: profile.phoneE164,
        }
      : null,
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  return buildSessionResponse(request);
}

export async function action({ request }: ActionFunctionArgs) {
  return buildSessionResponse(request);
}
