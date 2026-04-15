import { NextRequest, NextResponse } from "next/server";
import { getActiveGstSettings, upsertGstSettings } from "../../../../services/gst/settings";

export const runtime = "nodejs";

export async function GET() {
  const result = await getActiveGstSettings();
  if (!result.ok || !result.data) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 404 });
  }

  const settings = result.data;
  return NextResponse.json({ ok: true, settings });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });
  }

  const result = await upsertGstSettings({
    legalName: String(body.legalName || ""),
    tradeName: body.tradeName ? String(body.tradeName) : null,
    gstin: String(body.gstin || ""),
    pan: body.pan ? String(body.pan) : null,
    stateCode: String(body.stateCode || ""),
    invoicePrefix: String(body.invoicePrefix || ""),
    creditNotePrefix: String(body.creditNotePrefix || ""),
    debitNotePrefix: String(body.debitNotePrefix || ""),
    invoiceNumberStrategy:
      body.invoiceNumberStrategy === "CALENDAR_YEAR_SEQUENCE" ||
      body.invoiceNumberStrategy === "MONTHLY_SEQUENCE" ||
      body.invoiceNumberStrategy === "MANUAL"
        ? body.invoiceNumberStrategy
        : "FINANCIAL_YEAR_SEQUENCE",
    defaultCurrency: body.defaultCurrency ? String(body.defaultCurrency) : "INR",
    einvoiceEnabled: Boolean(body.einvoiceEnabled),
    isActive: body.isActive === false ? false : true,
  });

  if (!result.ok || !result.data) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  const settings = result.data;
  return NextResponse.json({ ok: true, settings }, { status: 201 });
}
