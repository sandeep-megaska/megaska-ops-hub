import { NextRequest } from "next/server";
import { prisma } from "../db/prisma";
import { hashSessionToken } from "../auth/session";

export async function getAuthenticatedCustomer(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const queryToken = req.nextUrl.searchParams.get("token")?.trim() ?? "";
  const sessionToken = bearerToken || queryToken;

  if (!sessionToken) {
    return null;
  }

  return prisma.authSession.findFirst({
    where: {
      sessionTokenHash: hashSessionToken(sessionToken),
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });
}
