import type { GstServiceResult } from "./types";

export interface GstComplianceCheck {
  valid: boolean;
  messages: string[];
}

export function validateCompliance(): GstServiceResult<GstComplianceCheck> {
  return {
    ok: true,
    data: {
      valid: true,
      messages: [],
    },
  };
}
