import { getGstInvoiceById } from "./invoice";
import type { GstServiceResult } from "./types";

export interface GstPdfRenderPayload {
  gstDocumentId: string;
  documentNumber: string;
  html: string;
  metadata: {
    generatedAt: string;
    renderer: "GST_HTML_RENDERER_V2";
    templateType: "invoice" | "credit_note" | "debit_note";
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function resolveTemplateType(documentType: string): GstPdfRenderPayload["metadata"]["templateType"] {
  if (documentType === "CREDIT_NOTE") {
    return "credit_note";
  }
  if (documentType === "DEBIT_NOTE") {
    return "debit_note";
  }
  return "invoice";
}

function renderHeader(title: string, documentNumber: string, status: string): string {
  return `
    <header>
      <h1>${escapeHtml(title)}</h1>
      <p>Document Number: ${escapeHtml(documentNumber)}</p>
      <p>Status: ${escapeHtml(status)}</p>
    </header>
  `;
}

export async function renderGstPdf(
  gstDocumentId: string,
): Promise<GstServiceResult<GstPdfRenderPayload>> {
  const documentResult = await getGstInvoiceById(gstDocumentId);
  if (!documentResult.ok || !documentResult.data) {
    return { ok: false, error: documentResult.error || "GST document not found" };
  }

  const documentNumber = String(documentResult.data.documentNumber || "");
  const status = String(documentResult.data.status || "");
  const documentType = String(documentResult.data.documentType || "TAX_INVOICE");
  const templateType = resolveTemplateType(documentType);

  const title =
    templateType === "invoice"
      ? "Tax Invoice"
      : templateType === "credit_note"
        ? "Credit Note"
        : "Debit Note";

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(documentNumber)}</title>
  </head>
  <body>
    ${renderHeader(title, documentNumber, status)}
    <section>
      <h2>GST ${escapeHtml(documentType)}</h2>
      <p>This HTML payload is the renderer foundation for a binary PDF pipeline.</p>
      <p>Totals: ${escapeHtml(String(documentResult.data.totalAmount || "0"))}</p>
    </section>
  </body>
</html>`;

  console.info("[GST PDF] Generated GST renderer payload", {
    gstDocumentId,
    documentNumber,
    templateType,
  });

  return {
    ok: true,
    data: {
      gstDocumentId,
      documentNumber,
      html,
      metadata: {
        generatedAt: new Date().toISOString(),
        renderer: "GST_HTML_RENDERER_V2",
        templateType,
      },
    },
  };
}
