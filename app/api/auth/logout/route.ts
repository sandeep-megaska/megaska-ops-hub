import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../services/db/prisma";
import { hashSessionToken } from "../../../../services/auth/session";
import { withCors, handleOptions } from "../../_lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req.headers.get("origin"));
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");

  try {
    const body = await req.json().catch(() => ({}));
    const bodyToken = String(body?.token ?? "").trim();

    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : "";

    const sessionToken = bearerToken || bodyToken;

    if (!sessionToken) {
      return withCors(
        NextResponse.json(
          { success: false, error: "Session token required" },
          { status: 400 }
        ),
        origin
      );
    }

    const sessionTokenHash = hashSessionToken(sessionToken);

    const session = await prisma.authSession.findFirst({
      where: {
        sessionTokenHash,
        revokedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!session) {
      return withCors(
        NextResponse.json({
          success: true,
          revoked: false,
        }),
        origin
      );
    }

    await prisma.authSession.update({
      where: {
        id: session.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return withCors(
      NextResponse.json({
        success: true,
        revoked: true,
      }),
      origin
    );
  } catch (error) {
    console.error("[AUTH LOGOUT ERROR]", error);

    return withCors(
      NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Internal error",
        },
        { status: 500 }
      ),
      origin
    );
  }
}