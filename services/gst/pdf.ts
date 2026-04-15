import { getGstInvoiceById } from "./invoice";
import type { GstServiceResult } from "./types";

export interface GstPdfRenderPayload {
  gstDocumentId: string;
  documentNumber: string;
  html: string;
  metadata: {
    generatedAt: string;
    renderer: "GST_HTML_PLACEHOLDER_V1";
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

export async function renderGstPdf(
  gstDocumentId: string,
): Promise<GstServiceResult<GstPdfRenderPayload>> {
  const documentResult = await getGstInvoiceById(gstDocumentId);
  if (!documentResult.ok || !documentResult.data) {
    return { ok: false, error: documentResult.error || "GST document not found" };
  }

  const documentNumber = String(documentResult.data.documentNumber || "");
  const status = String(documentResult.data.status || "");
  const html = `<!doctype html>
<html>
  <head>
    <meta charset=\"utf-8\" />
    <title>${escapeHtml(documentNumber)}</title>
  </head>
  <body>
    <h1>GST Document ${escapeHtml(documentNumber)}</h1>
    <p>Status: ${escapeHtml(status)}</p>
    <p>This is a placeholder renderer payload for future PDF generation.</p>
  </body>
</html>`;

  console.info("[GST PDF] Generated GST placeholder render payload", {
    gstDocumentId,
    documentNumber,
  });

  return {
    ok: true,
    data: {
      gstDocumentId,
      documentNumber,
      html,
      metadata: {
        generatedAt: new Date().toISOString(),
        renderer: "GST_HTML_PLACEHOLDER_V1",
      },
    },
  };
}
