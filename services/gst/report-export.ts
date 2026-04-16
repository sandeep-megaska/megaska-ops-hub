import type { GstServiceResult } from "./types";

export interface GenerateReportRunInput {
  gstSettingsId: string;
  reportType: string;
  periodStart: Date | string;
  periodEnd: Date | string;
  format: "CSV" | "XLSX";
  filters?: Record<string, unknown>;
}

export interface GstReportRunRecord {
  id: string;
  gstSettingsId: string;
  reportType: string;
  periodStart: Date;
  periodEnd: Date;
  format: string;
  status: string;
  fileUrl: string | null;
  rowCount: number;
  generatedAt: Date | null;
  errorMessage: string | null;
}

export interface ReportRunFilters {
  gstSettingsId?: string;
  reportType?: string;
  status?: string;
}

export async function generateReportRun(input: GenerateReportRunInput): Promise<GstServiceResult<GstReportRunRecord>> {
  return { ok: false, error: `Not implemented: generateReportRun (${input.reportType})` };
}

export async function getReportRun(id: string): Promise<GstServiceResult<GstReportRunRecord | null>> {
  return { ok: true, data: null };
}

export async function listReportRuns(filters: ReportRunFilters): Promise<GstServiceResult<GstReportRunRecord[]>> {
  return { ok: true, data: [] };
}

export async function downloadReportFile(id: string): Promise<GstServiceResult<{ fileUrl: string | null }>> {
  return { ok: true, data: { fileUrl: null } };
}
