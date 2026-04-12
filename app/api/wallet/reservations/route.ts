import { NextRequest, NextResponse } from "next/server";
import { hashSessionToken } from "../../../../services/auth/session";
import { prisma } from "../../../../services/db/prisma";

const SHOPIFY_DEBUG_ORIGIN = "https://megaskastore.myshopify.com";

function applyWalletReservationsCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", SHOPIFY_DEBUG_ORIGIN);
  response.headers.set("Vary", "Origin");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
  return response;
}

export async function OPTIONS() {
  return applyWalletReservationsCors(new NextResponse(null, { status: 204 }));
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const queryToken = req.nextUrl.searchParams.get("token")?.trim() ?? "";
  const sessionToken = bearerToken || queryToken;

  if (!sessionToken) {
    return applyWalletReservationsCors(
      NextResponse.json({ ok: false, error: "Session token required" }, { status: 401 })
    );
  }

  const now = new Date();
  const session = await prisma.authSession.findFirst({
    where: {
      sessionTokenHash: hashSessionToken(sessionToken),
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
    return applyWalletReservationsCors(
      NextResponse.json({ ok: false, error: "Invalid or expired session" }, { status: 401 })
    );
  }

  const reservations = await prisma.$queryRaw<
    Array<{
      id: string;
      reservedAmount: number;
      currency: string;
      status: "ACTIVE" | "CONSUMED" | "RELEASED" | "EXPIRED";
      discountCode: string | null;
      orderNumber: string | null;
      shopifyOrderId: string | null;
      expiresAt: Date;
      createdAt: Date;
      updatedAt: Date;
    }>
  >`
    SELECT "id", "reservedAmount", "currency", "status", "discountCode", "orderNumber", "shopifyOrderId", "expiresAt", "createdAt", "updatedAt"
    FROM "WalletReservation"
    WHERE "customerProfileId" = ${session.customer.id}
    ORDER BY "createdAt" DESC
    LIMIT 100
  `;

  return applyWalletReservationsCors(NextResponse.json({ ok: true, reservations }));
}
