import type { GstDocumentInput, GstServiceResult } from "./types";

export async function buildNoteDraft(
  _input: GstDocumentInput,
): Promise<GstServiceResult<{ id?: string }>> {
  return { ok: true, data: {} };
}
