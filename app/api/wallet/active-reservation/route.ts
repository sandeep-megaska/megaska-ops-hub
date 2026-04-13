import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

async function resolveSession(req: NextRequest) {
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

function normalizeCartId(value: unknown) {
  return String(value || "").trim();
}

export async function GET(req: NextRequest) {
  try {
    const session = await resolveSession(req);
    if (!session) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const requestedCartId = normalizeCartId(
      req.nextUrl.searchParams.get("cartId") ||
      req.nextUrl.searchParams.get("cartToken")
    );

    if (!requestedCartId) {
      return NextResponse.json({ ok: false, error: "cartId is required" }, { status: 400 });
    }

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
        code: true,
        cartId: true,
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

    const reservationCartId = normalizeCartId(reservation.cartId);
    const cartMatches = reservationCartId === requestedCartId;

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
