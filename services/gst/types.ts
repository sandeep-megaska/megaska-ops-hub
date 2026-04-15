export type GstDocumentType = "TAX_INVOICE" | "CREDIT_NOTE" | "DEBIT_NOTE";

export type GstDocumentStatus =
  | "DRAFT"
  | "ISSUED"
  | "CANCELLED"
  | "VOID"
  | "FAILED";

export type GstNumberingStrategy =
  | "FINANCIAL_YEAR_SEQUENCE"
  | "CALENDAR_YEAR_SEQUENCE"
  | "MONTHLY_SEQUENCE"
  | "MANUAL";

export type GstSupplyType =
  | "B2B"
  | "B2C"
  | "EXPORT"
  | "SEZ_WITH_PAYMENT"
  | "SEZ_WITHOUT_PAYMENT"
  | "DEEMED_EXPORT";

export interface GstTaxBreakdown {
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cessAmount: number;
  totalAmount: number;
}

export interface GstDocumentLineInput {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  hsnOrSac?: string;
  unit?: string;
  discount?: number;
}

export interface GstDocumentInput {
  documentType: GstDocumentType;
  supplyType: GstSupplyType;
  placeOfSupplyStateCode: string;
  isInterstate: boolean;
  currency?: string;
  lines: GstDocumentLineInput[];
}

export interface GstServiceResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface GstExportRequest {
  gstSettingsId: string;
  exportType: string;
  periodStart: Date;
  periodEnd: Date;
}

export interface GstPartyInput {
  legalName?: string;
  gstin?: string | null;
  stateCode?: string | null;
}

export interface GstInvoiceDraftInput {
  gstSettingsId?: string;
  documentDate?: Date | string;
  billingStateCode?: string | null;
  shippingStateCode?: string | null;
  buyer?: GstPartyInput;
  supplyType?: GstSupplyType;
  placeOfSupplyStateCode?: string;
  isInterstate?: boolean;
  currency?: string;
  lines: GstDocumentLineInput[];
  metadata?: Record<string, unknown>;
}
