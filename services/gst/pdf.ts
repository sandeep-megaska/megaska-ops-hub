import { getGstInvoiceById } from "./invoice";
import { getGstNoteById } from "./notes";
import type { GstServiceResult } from "./types";

export interface GstPdfRenderPayload {
  gstDocumentId: string;
  documentNumber: string;
  html: string;
  metadata: {
    generatedAt: string;
    renderer: "GST_HTML_RENDERER_V3";
    templateType: "invoice" | "credit_note" | "debit_note";
  };
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function asAmount(value: unknown): string {
  return Number(value || 0).toFixed(2);
}

function formatDate(value: unknown): string {
  const d = new Date(String(value || ""));
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export async function renderGstPdf(gstDocumentId: string): Promise<GstServiceResult<GstPdfRenderPayload>> {
  const invoiceResult = await getGstInvoiceById(gstDocumentId);
  const documentResult = invoiceResult.ok ? invoiceResult : await getGstNoteById(gstDocumentId);

  if (!documentResult.ok || !documentResult.data) {
    return { ok: false, error: documentResult.error || "GST document not found" };
  }

  const doc = documentResult.data;
  const documentType = String(doc.documentType || "TAX_INVOICE");
  const templateType = documentType === "CREDIT_NOTE" ? "credit_note" : documentType === "DEBIT_NOTE" ? "debit_note" : "invoice";
  const title = templateType === "invoice" ? "Tax Invoice" : templateType === "credit_note" ? "Credit Note" : "Debit Note";
  const lines = Array.isArray(doc.lines) ? (doc.lines as Array<Record<string, unknown>>) : [];
  const snapshot = (doc.jsonSnapshot || {}) as Record<string, unknown>;
  const seller = (snapshot.settings || {}) as Record<string, unknown>;
  const buyer = (snapshot.buyer || {}) as Record<string, unknown>;

  const rows = lines
    .map(
      (line) => `<tr>
      <td>${escapeHtml(String(line.lineNumber || ""))}</td>
      <td>${escapeHtml(String(line.description || ""))}</td>
      <td>${escapeHtml(String(line.hsnOrSac || ""))}</td>
      <td>${escapeHtml(String(line.quantity || ""))}</td>
      <td>${asAmount(line.unitPrice)}</td>
      <td>${asAmount(line.taxableAmount)}</td>
      <td>${asAmount(line.taxRate)}</td>
      <td>${asAmount(line.cgstAmount)}</td>
      <td>${asAmount(line.sgstAmount)}</td>
      <td>${asAmount(line.igstAmount)}</td>
      <td>${asAmount(line.lineTotal)}</td>
    </tr>`,
    )
    .join("\n");

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(String(doc.documentNumber || ""))}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
      .header { display: flex; justify-content: space-between; margin-bottom: 12px; }
      .block { border: 1px solid #ddd; padding: 12px; margin: 10px 0; border-radius: 6px; }
      table { border-collapse: collapse; width: 100%; font-size: 12px; }
      th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
      .totals { width: 380px; margin-left: auto; margin-top: 12px; }
      .totals td { border: 0; padding: 4px 0; }
      .totals .label { color: #666; }
      .totals .value { text-align: right; }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <h1>${escapeHtml(title)}</h1>
        <div>Document: ${escapeHtml(String(doc.documentNumber || ""))}</div>
        <div>Date: ${escapeHtml(formatDate(doc.documentDate))}</div>
      </div>
      <div>
        <div>Status: ${escapeHtml(String(doc.status || ""))}</div>
        <div>Supply Type: ${escapeHtml(String(doc.supplyType || ""))}</div>
        <div>POS: ${escapeHtml(String(doc.placeOfSupplyStateCode || ""))}</div>
      </div>
    </div>

    <div class="block">
      <strong>Seller</strong>
      <div>${escapeHtml(String(seller.legalName || ""))}</div>
      <div>GSTIN: ${escapeHtml(String(seller.gstin || ""))}</div>
      <div>State Code: ${escapeHtml(String(seller.stateCode || ""))}</div>
    </div>

    <div class="block">
      <strong>Buyer</strong>
      <div>${escapeHtml(String(buyer.legalName || "Unregistered Buyer"))}</div>
      <div>GSTIN: ${escapeHtml(String(buyer.gstin || ""))}</div>
      <div>State Code: ${escapeHtml(String(buyer.stateCode || ""))}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th><th>Description</th><th>HSN/SAC</th><th>Qty</th><th>Unit Price</th><th>Taxable</th><th>Rate%</th><th>CGST</th><th>SGST</th><th>IGST</th><th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <table class="totals">
      <tr><td class="label">Taxable Amount</td><td class="value">${asAmount(doc.taxableAmount)}</td></tr>
      <tr><td class="label">CGST</td><td class="value">${asAmount(doc.cgstAmount)}</td></tr>
      <tr><td class="label">SGST</td><td class="value">${asAmount(doc.sgstAmount)}</td></tr>
      <tr><td class="label">IGST</td><td class="value">${asAmount(doc.igstAmount)}</td></tr>
      <tr><td class="label">CESS</td><td class="value">${asAmount(doc.cessAmount)}</td></tr>
      <tr><td class="label"><strong>Total Amount</strong></td><td class="value"><strong>${asAmount(doc.totalAmount)}</strong></td></tr>
    </table>
  </body>
</html>`;

  return {
    ok: true,
    data: {
      gstDocumentId,
      documentNumber: String(doc.documentNumber || ""),
      html,
      metadata: {
        generatedAt: new Date().toISOString(),
        renderer: "GST_HTML_RENDERER_V3",
        templateType,
      },
    },
  };
}
