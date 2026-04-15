import type { GstServiceResult } from "./types";

export async function renderGstPdf(
  _gstDocumentId: string,
): Promise<GstServiceResult<{ pdfUrl?: string }>> {
  return { ok: true, data: {} };
}
