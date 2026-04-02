import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../services/db/prisma";
import { withCors, handleOptions } from "../../_lib/cors";
import {
  getOtpProvider,
  normalizeIndianPhone,
  sendOtpWithTwilioVerify,
} from "../../../../services/auth/otp";

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

    const provider = getOtpProvider();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    if (provider === "twilio") {
      try {
        const twilioVerification = await sendOtpWithTwilioVerify(phoneE164);

        const challenge = await prisma.oTPChallenge.create({
          data: {
            phoneE164,
            provider,
            providerSid: twilioVerification.sid || null,
            status: "pending",
            attemptsCount: 0,
            expiresAt,
            metadata: {
              mode: "twilio",
              twilioStatus: twilioVerification.status,
            },
          },
        });

        console.log("[OTP REQUEST CREATED]", {
          challengeId: challenge.id,
          phoneE164,
          provider,
          twilioVerificationSid: twilioVerification.sid,
          twilioStatus: twilioVerification.status,
        });

        return withCors(
          req,
          NextResponse.json({
            success: true,
            otpSent: true,
            challengeId: challenge.id,
            phone: phoneE164,
            provider,
          })
        );
      } catch (twilioError) {
        console.error("[OTP REQUEST TWILIO ERROR]", {
          phoneE164,
          provider,
          message:
            twilioError instanceof Error ? twilioError.message : "Twilio request failed",
        });

        return withCors(
          req,
          NextResponse.json(
            {
              error: "Unable to send OTP right now. Please try again shortly.",
            },
            { status: 502 }
          )
        );
      }
    }

    const otp = generateOtp();

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
      provider: "mock",
      otp,
    });

    return withCors(
      req,
      NextResponse.json({
        success: true,
        otpSent: true,
        challengeId: challenge.id,
        phone: phoneE164,
        mock: true,
        provider: "mock",
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
