import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../services/db/prisma";
import { hashSessionToken } from "../../../../services/auth/session";
import { withCors, handleOptions } from "../../_lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req.headers.get("origin"));
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");

  try {
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : "";

    const queryToken = req.nextUrl.searchParams.get("token")?.trim() ?? "";

    const sessionToken = bearerToken || queryToken;

    if (!sessionToken) {
      return withCors(
        NextResponse.json(
          { authenticated: false, error: "Session token required" },
          { status: 401 }
        ),
        origin
      );
    }

    const sessionTokenHash = hashSessionToken(sessionToken);
    const now = new Date();

    const session = await prisma.authSession.findFirst({
      where: {
        sessionTokenHash,
        revokedAt: null,
        expiresAt: {
          gt: now,
        },
      },
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!session) {
      return withCors(
        NextResponse.json(
          { authenticated: false, error: "Invalid or expired session" },
          { status: 401 }
        ),
        origin
      );
    }

    await prisma.authSession.update({
      where: {
        id: session.id,
      },
      data: {
        lastSeenAt: now,
      },
    });

    return withCors(
      NextResponse.json({
        authenticated: true,
        session: {
          id: session.id,
          expiresAt: session.expiresAt,
          lastSeenAt: now,
        },
        customer: {
          id: session.customer.id,
          phoneE164: session.customer.phoneE164,
          firstName: session.customer.firstName,
          email: session.customer.email,
          phoneVerifiedAt: session.customer.phoneVerifiedAt,
          profileCompletedAt: session.customer.profileCompletedAt,
          shopifyCustomerId: session.customer.shopifyCustomerId,
        },
      }),
      origin
    );
  } catch (error) {
    console.error("[AUTH SESSION ERROR]", error);

    return withCors(
      NextResponse.json(
        {
          authenticated: false,
          error: error instanceof Error ? error.message : "Internal error",
        },
        { status: 500 }
      ),
      origin
    );
  }
}