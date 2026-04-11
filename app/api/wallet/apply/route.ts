import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "../../_lib/cors";
import { hashSessionToken } from "../../../../services/auth/session";
import { prisma } from "../../../../services/db/prisma";
import { parseAmountToMinorUnits } from "../../../../services/wallet";
import { createWalletReservation } from "../../../../services/wallet-reservation";
import { resolveCartId } from "../../../../services/shopify/storefront";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

    if (!bearerToken) {
      return withCors(req, NextResponse.json({ ok: false, error: "Session token required" }, { status: 401 }));
    }

    const now = new Date();
    const session = await prisma.authSession.findFirst({
      where: {
        sessionTokenHash: hashSessionToken(bearerToken),
        revokedAt: null,
        expiresAt: { gt: now },
      },
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!session?.customer) {
      return withCors(req, NextResponse.json({ ok: false, error: "Invalid or expired session" }, { status: 401 }));
    }

    const body = (await req.json().catch(() => ({}))) as {
      cartId?: string;
      cartToken?: string;
      walletAmount?: number | string;
      sourceFlow?: "CHECKOUT" | "BUY_NOW";
    };

    const cartId = resolveCartId({ cartId: body.cartId, cartToken: body.cartToken });
    const amountMinor = parseAmountToMinorUnits(body.walletAmount || "");

    if (!cartId) {
      return withCors(req, NextResponse.json({ ok: false, error: "cartId/cartToken required" }, { status: 400 }));
    }

    if (amountMinor <= 0) {
      return withCors(req, NextResponse.json({ ok: false, error: "walletAmount must be greater than 0" }, { status: 400 }));
    }

    const reservation = await createWalletReservation({
      customerProfileId: session.customer.id,
      cartId,
      amountMinor,
      sourceFlow: body.sourceFlow || "CHECKOUT",
      sessionReference: session.id,
    });

    return withCors(req, NextResponse.json({ ok: true, reservation }));
  } catch (error) {
    return withCors(
      req,
      NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed" }, { status: 500 })
    );
  }
}
