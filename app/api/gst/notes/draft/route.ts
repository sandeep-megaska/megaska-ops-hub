import { NextRequest, NextResponse } from "next/server";
import { buildNoteDraft } from "../../../../../services/gst/notes";
import type { GstNoteDraftInput } from "../../../../../services/gst/types";

export const runtime = "nodejs";

function parseDraftPayload(body: Record<string, unknown>): GstNoteDraftInput {
  return {
    noteType: body.noteType === "DEBIT_NOTE" ? "DEBIT_NOTE" : "CREDIT_NOTE",
    originalDocumentId: body.originalDocumentId ? String(body.originalDocumentId) : undefined,
    gstSettingsId: body.gstSettingsId ? String(body.gstSettingsId) : undefined,
    sourceOrderId: body.sourceOrderId ? String(body.sourceOrderId) : undefined,
    sourceOrderNumber: body.sourceOrderNumber ? String(body.sourceOrderNumber) : undefined,
    sourceReference: body.sourceReference ? String(body.sourceReference) : undefined,
    shopifyOrderId: body.shopifyOrderId ? String(body.shopifyOrderId) : undefined,
    shopifyOrderName: body.shopifyOrderName ? String(body.shopifyOrderName) : undefined,
    documentDate: body.documentDate ? String(body.documentDate) : undefined,
    billingStateCode: body.billingStateCode ? String(body.billingStateCode) : null,
    shippingStateCode: body.shippingStateCode ? String(body.shippingStateCode) : null,
    buyer: {
      legalName: body.buyer && typeof body.buyer === "object" ? String((body.buyer as Record<string, unknown>).legalName || "") : undefined,
      gstin: body.buyer && typeof body.buyer === "object" ? String((body.buyer as Record<string, unknown>).gstin || "") : null,
      stateCode: body.buyer && typeof body.buyer === "object" ? String((body.buyer as Record<string, unknown>).stateCode || "") : null,
    },
    supplyType:
      body.supplyType === "B2B" ||
      body.supplyType === "B2C" ||
      body.supplyType === "EXPORT" ||
      body.supplyType === "SEZ_WITH_PAYMENT" ||
      body.supplyType === "SEZ_WITHOUT_PAYMENT" ||
      body.supplyType === "DEEMED_EXPORT"
        ? body.supplyType
        : undefined,
    placeOfSupplyStateCode: body.placeOfSupplyStateCode
      ? String(body.placeOfSupplyStateCode)
      : undefined,
    isInterstate: typeof body.isInterstate === "boolean" ? body.isInterstate : undefined,
    currency: body.currency ? String(body.currency) : undefined,
    lines: Array.isArray(body.lines)
      ? body.lines.map((line) => {
          const safeLine = (line || {}) as Record<string, unknown>;
          return {
            description: String(safeLine.description || ""),
            quantity: Number(safeLine.quantity || 0),
            unitPrice: Number(safeLine.unitPrice || 0),
            taxRate: Number(safeLine.taxRate || 0),
            hsnOrSac: safeLine.hsnOrSac ? String(safeLine.hsnOrSac) : undefined,
            unit: safeLine.unit ? String(safeLine.unit) : undefined,
            discount: Number(safeLine.discount || 0),
          };
        })
      : [],
    metadata: body.metadata && typeof body.metadata === "object" ? (body.metadata as Record<string, unknown>) : {},
  };
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });
  }

  const result = await buildNoteDraft(parseDraftPayload(body));

  if (!result.ok || !result.data) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  const note = result.data;
  return NextResponse.json({ ok: true, note }, { status: 201 });
}
