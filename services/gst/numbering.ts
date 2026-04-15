import type { GstDocumentType, GstServiceResult } from "./types";

export interface GstNumberRequest {
  gstSettingsId: string;
  documentType: GstDocumentType;
  documentDate: Date;
}

export async function reserveGstNumber(
  _request: GstNumberRequest,
): Promise<GstServiceResult<{ documentNumber?: string }>> {
  return { ok: true, data: {} };
}
