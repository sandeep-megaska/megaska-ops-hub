import type { GstServiceResult } from "./types";

export interface GstGenerateReportRunInput {
  gstSettingsId: string;
  reportType: "B2C_SALES_REGISTER" | "NOTE_REGISTER" | "HSN_SUMMARY" | "PERIOD_SUMMARY";
  periodStart: Date;
  periodEnd: Date;
  format: "CSV" | "XLSX";
  filters?: Record<string, unknown>;
}

export interface GstReportRunFilters {
  reportType?: GstGenerateReportRunInput["reportType"];
  status?: "QUEUED" | "GENERATED" | "FAILED";
  page?: number;
  pageSize?: number;
}

export async function generateReportRun(input: GstGenerateReportRunInput): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { ...input, placeholder: true } };
}

export async function getReportRun(id: string): Promise<GstServiceResult<Record<string, unknown> | null>> {
  return { ok: true, data: { id, placeholder: true } };
}

export async function listReportRuns(filters: GstReportRunFilters): Promise<GstServiceResult<Array<Record<string, unknown>>>> {
  return { ok: true, data: [{ filters, placeholder: true }] };
}

export async function downloadReportFile(id: string): Promise<GstServiceResult<Record<string, unknown>>> {
  return { ok: true, data: { id, placeholder: true } };
}
