import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

async function resolveCustomerProfileId(req: NextRequest): Promise<string | null> {
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
    select: { customerProfileId: true },
  });

  return session?.customerProfileId || null;
}

export async function POST(req: NextRequest) {
  try {
    const customerProfileId = await resolveCustomerProfileId(req);
    if (!customerProfileId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const reservationId = String(body?.reservationId || "").trim();

    if (!reservationId) {
      return NextResponse.json(
        { ok: false, error: "reservationId is required" },
        { status: 400 }
      );
    }

    await prisma.walletReservation.updateMany({
      where: {
        id: reservationId,
        customerProfileId,
        status: { in: ["HELD", "ACTIVE", "APPLIED"] },
      },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(), // remove if field does not exist
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("[WALLET CLEAR STALE] error", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
