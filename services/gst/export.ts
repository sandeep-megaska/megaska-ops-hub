import type { GstExportRequest, GstServiceResult } from "./types";

export async function prepareGstExport(
  _request: GstExportRequest,
): Promise<GstServiceResult<{ exportId?: string }>> {
  return { ok: true, data: {} };
}
