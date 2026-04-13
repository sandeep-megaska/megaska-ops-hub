import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

type SessionPayload = {
  customerProfileId: string;
  sessionTokenHash: string;
};

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

async function resolveSession(req: NextRequest): Promise<SessionPayload | null> {
  const authHeader = req.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : null;

  const token =
    bearer ||
    req.nextUrl.searchParams.get("token") ||
    req.cookies.get("megaska_session")?.value ||
    null;

  if (!token) return null;

  const sessionTokenHash = sha256(token);

  const session = await prisma.authSession.findFirst({
    where: {
      sessionTokenHash,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: {
      customerProfileId: true,
      sessionTokenHash: true,
    },
  });

  if (!session) return null;

  await prisma.authSession.updateMany({
    where: { sessionTokenHash },
    data: { lastSeenAt: new Date() },
  });

  return session;
}

function normalizeCartFingerprint(input: unknown): string {
  return String(input || "").trim();
}

export async function GET(req: NextRequest) {
  try {
    const session = await resolveSession(req);
    if (!session) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const cartId =
      req.nextUrl.searchParams.get("cartId") ||
      req.nextUrl.searchParams.get("cartToken") ||
      "";

    const cartFingerprint = normalizeCartFingerprint(cartId);

    if (!cartFingerprint) {
      return NextResponse.json(
        { ok: false, error: "cartId is required" },
        { status: 400 }
      );
    }

    // Adjust field names here only if your schema differs.
    const reservation = await prisma.walletReservation.findFirst({
      where: {
        customerProfileId: session.customerProfileId,
        status: { in: ["HELD", "ACTIVE", "APPLIED"] },
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amount: true,
        code: true,          // change to discountCode if that is your real field
        cartId: true,        // change if your schema uses cartToken/cartFingerprint
        expiresAt: true,
        status: true,
        createdAt: true,
      },
    });

    if (!reservation) {
      return NextResponse.json({
        ok: true,
        reservation: null,
        cartMatches: false,
      });
    }

    const reservationCart = normalizeCartFingerprint(reservation.cartId);
    const cartMatches = reservationCart === cartFingerprint;

    return NextResponse.json({
      ok: true,
      reservation: {
        reservationId: reservation.id,
        amount: Number(reservation.amount || 0),
        discountCode: reservation.code || null,
        cartId: reservation.cartId || null,
        expiresAt: reservation.expiresAt,
        status: reservation.status,
        createdAt: reservation.createdAt,
      },
      cartMatches,
    });
  } catch (error: any) {
    console.error("[WALLET ACTIVE RESERVATION] error", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
