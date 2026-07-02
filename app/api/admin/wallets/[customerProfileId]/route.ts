import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../services/db/prisma";
import { getOrCreateWalletAccount, listWalletTransactions } from "../../../../../services/wallet";

function isAdmin(req: NextRequest) {
  const key = req.headers.get("x-admin-key") || "";
  const expected = String(process.env.ADMIN_OPS_KEY || "").trim();
  return Boolean(expected && key === expected);
}

export async function GET(req: NextRequest, context: { params: Promise<{ customerProfileId: string }> }) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customerProfileId } = await context.params;

    const customer = await prisma.customerProfile.findUnique({
      where: { id: customerProfileId },
      select: {
        id: true,
        phoneE164: true,
        email: true,
        firstName: true,
        lastName: true,
        fullName: true,
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const wallet = await getOrCreateWalletAccount(customerProfileId, "INR");
    const transactions = await listWalletTransactions(customerProfileId, "INR", 150);

    return NextResponse.json({ customer, wallet, transactions });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
