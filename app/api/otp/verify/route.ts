import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../services/db/prisma";
import {
  generateSessionToken,
  hashSessionToken,
} from "../../../../services/auth/session";
import { withCors, handleOptions } from "../../_lib/cors";

function normalizeIndianPhone(input: string) {
  const digits = input.replace(/\D/g, "");

  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (input.startsWith("+91") && digits.length === 12) return `+${digits}`;

  return null;
}

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req.headers.get("origin"));
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");

  try {
    const body = await req.json();
    const phoneRaw = String(body?.phone ?? "").trim();
    const otpRaw = String(body?.otp ?? "").trim();

    if (!phoneRaw) {
      return withCors(
        NextResponse.json({ error: "Phone required" }, { status: 400 }),
        origin
      );
    }

    if (!otpRaw) {
      return withCors(
        NextResponse.json({ error: "OTP required" }, { status: 400 }),
        origin
      );
    }

    const phoneE164 = normalizeIndianPhone(phoneRaw);

    if (!phoneE164) {
      return withCors(
        NextResponse.json({ error: "Invalid phone format" }, { status: 400 }),
        origin
      );
    }

    const challenge = await prisma.oTPChallenge.findFirst({
      where: {
        phoneE164,
        status: "pending",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!challenge) {
      return withCors(
        NextResponse.json(
          { error: "No pending OTP challenge found" },
          { status: 404 }
        ),
        origin
      );
    }

    if (challenge.expiresAt.getTime() < Date.now()) {
      await prisma.oTPChallenge.update({
        where: { id: challenge.id },
        data: { status: "expired" },
      });

      return withCors(
        NextResponse.json({ error: "OTP expired" }, { status: 400 }),
        origin
      );
    }

    const metadata =
      challenge.metadata && typeof challenge.metadata === "object"
        ? (challenge.metadata as Record<string, unknown>)
        : {};

    const storedOtp = String(metadata.otp ?? "");

    if (storedOtp !== otpRaw) {
      await prisma.oTPChallenge.update({
        where: { id: challenge.id },
        data: {
          attemptsCount: { increment: 1 },
        },
      });

      return withCors(
        NextResponse.json({ error: "Invalid OTP" }, { status: 400 }),
        origin
      );
    }

    const now = new Date();

    const verifiedChallenge = await prisma.oTPChallenge.update({
      where: { id: challenge.id },
      data: {
        status: "verified",
        verifiedAt: now,
      },
    });

    let customerProfile = await prisma.customerProfile.findUnique({
      where: {
        phoneE164,
      },
    });

    if (!customerProfile) {
      customerProfile = await prisma.customerProfile.create({
        data: {
          phoneE164,
          phoneVerifiedAt: now,
        },
      });
    } else if (!customerProfile.phoneVerifiedAt) {
      customerProfile = await prisma.customerProfile.update({
        where: {
          id: customerProfile.id,
        },
        data: {
          phoneVerifiedAt: now,
        },
      });
    }

    const sessionToken = generateSessionToken();
    const sessionTokenHash = hashSessionToken(sessionToken);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const authSession = await prisma.authSession.create({
      data: {
        customerProfileId: customerProfile.id,
        sessionTokenHash,
        expiresAt,
        lastSeenAt: now,
      },
    });

    return withCors(
      NextResponse.json({
        success: true,
        verified: true,
        phone: phoneE164,
        customerProfileId: customerProfile.id,
        sessionToken,
        sessionExpiresAt: authSession.expiresAt,
        mock: true,
        challengeId: verifiedChallenge.id,
      }),
      origin
    );
  } catch (error) {
    console.error("[OTP VERIFY ERROR]", error);

    return withCors(
      NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Internal error",
        },
        { status: 500 }
      ),
      origin
    );
  }
}