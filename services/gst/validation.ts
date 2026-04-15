import type { GstDocumentLineInput, GstInvoiceDraftInput, GstServiceResult } from "./types";

export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const PREFIX_REGEX = /^[A-Z0-9/_-]{1,12}$/;

const GST_STATE_CODES = new Set([
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "97", "99",
]);

function normalize(value: string | null | undefined): string {
  return String(value ?? "").trim();
}

export function isValidStateCode(value: string | null | undefined): boolean {
  return GST_STATE_CODES.has(normalize(value));
}

export function validateLineItems(lines: GstDocumentLineInput[]): GstServiceResult<true> {
  if (!Array.isArray(lines) || lines.length === 0) {
    return { ok: false, error: "At least one GST line is required" };
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const row = index + 1;

    if (!normalize(line.description)) {
      return { ok: false, error: `Line ${row}: description is required` };
    }
    if (Number(line.quantity) <= 0) {
      return { ok: false, error: `Line ${row}: quantity must be > 0` };
    }
    if (Number(line.unitPrice) < 0) {
      return { ok: false, error: `Line ${row}: unitPrice cannot be negative` };
    }
    if (Number(line.taxRate) < 0 || Number(line.taxRate) > 100) {
      return { ok: false, error: `Line ${row}: taxRate must be between 0 and 100` };
    }

    const gross = Number(line.quantity) * Number(line.unitPrice);
    const discount = Number(line.discount || 0);
    if (discount < 0) {
      return { ok: false, error: `Line ${row}: discount cannot be negative` };
    }
    if (discount > gross) {
      return { ok: false, error: `Line ${row}: discount cannot exceed gross amount` };
    }
  }

  return { ok: true, data: true };
}

export function validateDocumentDraftPayload(
  payload: GstInvoiceDraftInput,
): GstServiceResult<{ normalizedCurrency: string }> {
  const lineValidation = validateLineItems(payload.lines);
  if (!lineValidation.ok) {
    return { ok: false, error: lineValidation.error || "Invalid GST line items" };
  }

  if (payload.placeOfSupplyStateCode && !isValidStateCode(payload.placeOfSupplyStateCode)) {
    return { ok: false, error: "placeOfSupplyStateCode must be a valid GST state code" };
  }

  if (payload.billingStateCode && !isValidStateCode(payload.billingStateCode)) {
    return { ok: false, error: "billingStateCode must be a valid GST state code" };
  }

  if (payload.shippingStateCode && !isValidStateCode(payload.shippingStateCode)) {
    return { ok: false, error: "shippingStateCode must be a valid GST state code" };
  }

  const buyerGstin = normalize(payload.buyer?.gstin).toUpperCase();
  if (buyerGstin && !GSTIN_REGEX.test(buyerGstin)) {
    return { ok: false, error: "buyer.gstin must be a valid GSTIN" };
  }

  const buyerStateCode = normalize(payload.buyer?.stateCode);
  if (buyerStateCode && !isValidStateCode(buyerStateCode)) {
    return { ok: false, error: "buyer.stateCode must be a valid GST state code" };
  }

  const currency = normalize(payload.currency || "INR").toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) {
    return { ok: false, error: "currency must be a 3-letter ISO code" };
  }

  return { ok: true, data: { normalizedCurrency: currency } };
}
