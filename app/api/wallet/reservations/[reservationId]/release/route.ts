import { NextRequest, NextResponse } from "next/server";
import { releaseWalletReservation } from "../../../../../../services/wallet-reservation";

function isAdmin(req: NextRequest) {
  const key = req.headers.get("x-admin-key") || "";
  const expected = String(process.env.ADMIN_OPS_KEY || "").trim();
  return Boolean(expected && key === expected);
}

export async function POST(req: NextRequest, context: { params: Promise<{ reservationId: string }> }) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reservationId } = await context.params;
    const body = (await req.json().catch(() => ({}))) as { reason?: string };
    const result = await releaseWalletReservation({ reservationId, reason: body.reason });

    return NextResponse.json({ ok: true, reservation: result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
