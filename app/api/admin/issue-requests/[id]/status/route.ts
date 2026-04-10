import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../services/db/prisma";
import { ISSUE_ALLOWED_STATUS_TRANSITIONS } from "../../../../../../services/exchange/issue";
import { applyWalletTransaction, parseAmountToMinorUnits } from "../../../../../../services/wallet";

export const runtime = "nodejs";

function isAdmin(req: NextRequest) {
  const key = req.headers.get("x-admin-key") || "";
  const expected = String(process.env.ADMIN_OPS_KEY || "").trim();
  return Boolean(expected && key === expected);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const nextStatus = String(body?.nextStatus || "").trim();
    const adminNote = String(body?.adminNote || "").trim() || null;
    const adminId = String(body?.adminId || "").trim() || null;

    if (!nextStatus) {
      return NextResponse.json({ error: "nextStatus is required" }, { status: 400 });
    }

    const existing = await prisma.orderActionRequest.findFirst({
      where: { id, requestType: "ISSUE" },
      include: { items: { take: 1 } },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const allowed = ISSUE_ALLOWED_STATUS_TRANSITIONS[existing.status] || [];
    if (!allowed.includes(nextStatus) && nextStatus !== existing.status) {
      return NextResponse.json({ error: "Invalid status transition" }, { status: 400 });
    }

    const updated = await prisma.orderActionRequest.update({
      where: { id: existing.id },
      data: {
        status: nextStatus as never,
        adminNote: adminNote ?? existing.adminNote,
      },
      include: { items: { take: 1 }, customerProfile: { select: { id: true } } },
    });

    const paymentGatewayName =
      updated.items[0]?.eligibilitySnapshot &&
      typeof updated.items[0].eligibilitySnapshot === "object" &&
      "paymentGatewayName" in updated.items[0].eligibilitySnapshot
        ? String((updated.items[0].eligibilitySnapshot as { paymentGatewayName?: unknown }).paymentGatewayName || "")
        : "";
    const isCodRefund = paymentGatewayName.toLowerCase().includes("cod") || paymentGatewayName.toLowerCase().includes("cash");
    const refundAmountMinor = parseAmountToMinorUnits(updated.orderAmountSnapshot || "");

    if (nextStatus.toUpperCase() === "APPROVED" && isCodRefund && refundAmountMinor > 0) {
      try {
        await applyWalletTransaction({
          customerProfileId: updated.customerProfile.id,
          amount: refundAmountMinor,
          direction: "CREDIT",
          transactionType: "COD_REFUND_CREDIT",
          sourceType: "ISSUE_REQUEST",
          sourceId: updated.id,
          sourceReference: updated.id,
          orderNumber: updated.orderNumber,
          reason: "COD refund approved to wallet",
          adminNote: adminNote || "Approved from issue request status transition",
          createdByType: "SYSTEM",
          createdById: adminId,
        });
      } catch (walletError) {
        const message = walletError instanceof Error ? walletError.message : "Wallet credit failed";
        if (!message.includes("Unique constraint")) {
          return NextResponse.json({ error: message }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ request: updated });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
