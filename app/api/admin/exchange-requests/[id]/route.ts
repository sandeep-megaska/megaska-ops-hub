import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../services/db/prisma";

function isAdmin(req: NextRequest) {
  const key = req.headers.get("x-admin-key") || "";
  const expected = String(process.env.ADMIN_OPS_KEY || "").trim();
  return Boolean(expected && key === expected);
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const requestItem = await prisma.orderActionRequest.findFirst({
      where: { id, requestType: "EXCHANGE" },
      include: {
        items: true,
        payments: { orderBy: { createdAt: "desc" } },
        shipments: true,
      },
    });

    if (!requestItem) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ request: requestItem });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
