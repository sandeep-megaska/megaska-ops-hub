import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../services/db/prisma";

function isAdmin(req: NextRequest) {
  const key = req.headers.get("x-admin-key") || "";
  const expected = String(process.env.ADMIN_OPS_KEY || "").trim();
  return Boolean(expected && key === expected);
}

export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = req.nextUrl.searchParams.get("status")?.trim();
    const orderNumber = req.nextUrl.searchParams.get("orderNumber")?.trim();
    const customerPhone = req.nextUrl.searchParams.get("customerPhone")?.trim();

    const data = await prisma.orderActionRequest.findMany({
      where: {
        requestType: "EXCHANGE",
        ...(status ? { status: status as never } : {}),
        ...(orderNumber ? { orderNumber: { contains: orderNumber, mode: "insensitive" } } : {}),
        ...(customerPhone
          ? { customerPhoneSnapshot: { contains: customerPhone, mode: "insensitive" } }
          : {}),
      },
      include: {
        items: true,
        payments: { orderBy: { createdAt: "desc" }, take: 1 },
        shipments: true,
      },
      orderBy: { requestedAt: "desc" },
    });

    return NextResponse.json({ requests: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
