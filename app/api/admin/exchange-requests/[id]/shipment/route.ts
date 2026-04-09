import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../services/db/prisma";

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
    const direction = String(body?.direction || "").trim();
    const status = String(body?.status || "").trim() || "PENDING";

    if (!direction) {
      return NextResponse.json({ error: "direction is required" }, { status: 400 });
    }

    const existing = await prisma.orderActionRequest.findFirst({ where: { id, requestType: "EXCHANGE" } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const shipment = await prisma.shipmentTracking.upsert({
      where: {
        requestId_direction: {
          requestId: id,
          direction: direction as never,
        },
      },
      create: {
        requestId: id,
        direction: direction as never,
        carrier: String(body?.carrier || "").trim() || null,
        awb: String(body?.awb || "").trim() || null,
        trackingUrl: String(body?.trackingUrl || "").trim() || null,
        status: status as never,
      },
      update: {
        carrier: String(body?.carrier || "").trim() || null,
        awb: String(body?.awb || "").trim() || null,
        trackingUrl: String(body?.trackingUrl || "").trim() || null,
        status: status as never,
      },
    });

    return NextResponse.json({ shipment });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}
