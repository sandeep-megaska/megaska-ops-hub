import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../services/db/prisma";
import { withCors, handleOptions } from "../../_lib/cors";

function normalizeIndianPhone(input: string) {
  const digits = input.replace(/\D/g, "");

  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (input.startsWith("+91") && digits.length === 12) return `+${digits}`;

  return null;
}

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phoneRaw = String(body?.phone ?? "").trim();

    if (!phoneRaw) {
      return withCors(
        req,
        NextResponse.json({ error: "Phone required" }, { status: 400 })
      );
    }

    const phoneE164 = normalizeIndianPhone(phoneRaw);

    if (!phoneE164) {
      return withCors(
        req,
        NextResponse.json({ error: "Invalid phone format" }, { status: 400 })
      );
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const challenge = await prisma.oTPChallenge.create({
      data: {
        phoneE164,
        provider: "mock",
        status: "pending",
        attemptsCount: 0,
        expiresAt,
        metadata: {
          otp,
          mode: "mock",
        },
      },
    });

    console.log("[OTP REQUEST CREATED]", {
      challengeId: challenge.id,
      phoneE164,
      otp,
      provider: "mock",
    });

    return withCors(
      req,
      NextResponse.json({
        success: true,
        otpSent: true,
        challengeId: challenge.id,
        phone: phoneE164,
        mock: true,
      })
    );
  } catch (error) {
    console.error("[OTP REQUEST ERROR]", error);

    return withCors(
      req,
      NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Internal error",
        },
        { status: 500 }
      )
    );
  }
}
