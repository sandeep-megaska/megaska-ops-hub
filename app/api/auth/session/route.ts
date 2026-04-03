import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../services/db/prisma";
import { hashSessionToken } from "../../../../services/auth/session";
import { withCors, handleOptions } from "../../_lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : "";

    const queryToken = req.nextUrl.searchParams.get("token")?.trim() ?? "";

    const sessionToken = bearerToken || queryToken;

    if (!sessionToken) {
      return withCors(
        req,
        NextResponse.json(
          { authenticated: false, error: "Session token required" },
          { status: 401 }
        )
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
        req,
        NextResponse.json(
          { authenticated: false, error: "Invalid or expired session" },
          { status: 401 }
        )
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
      req,
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
          fullName: session.customer.fullName,
          firstName: session.customer.firstName,
          email: session.customer.email,
          phoneVerifiedAt: session.customer.phoneVerifiedAt,
          profileCompletedAt: session.customer.profileCompletedAt,
          shopifyCustomerId: session.customer.shopifyCustomerId,
          profileComplete: Boolean(
            session.customer.fullName?.trim() && session.customer.email?.trim()
          ),
        },
      })
    );
  } catch (error) {
    console.error("[AUTH SESSION ERROR]", error);

    return withCors(
      req,
      NextResponse.json(
        {
          authenticated: false,
          error: error instanceof Error ? error.message : "Internal error",
        },
        { status: 500 }
      )
    );
  }
}
