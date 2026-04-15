import { prisma } from "../db/prisma";

export interface GstSettingsRecord {
  id: string;
  legalName: string;
  tradeName: string | null;
  gstin: string;
  pan: string | null;
  stateCode: string;
  invoicePrefix: string;
  creditNotePrefix: string;
  debitNotePrefix: string;
  invoiceNumberStrategy: "FINANCIAL_YEAR_SEQUENCE" | "CALENDAR_YEAR_SEQUENCE" | "MONTHLY_SEQUENCE" | "MANUAL";
  defaultCurrency: string;
  einvoiceEnabled: boolean;
  isActive: boolean;
  updatedAt?: Date;
}

export interface GstCounterRecord {
  lastNumber: number;
}

export interface GstDocumentRecord {
  id: string;
  documentType: "TAX_INVOICE" | "CREDIT_NOTE" | "DEBIT_NOTE";
  status: "DRAFT" | "ISSUED" | "CANCELLED" | "VOID" | "FAILED";
  documentNumber: string;
  documentDate: Date;
  gstSettingsId: string;
  totalAmount: unknown;
  taxableAmount: unknown;
  cgstAmount: unknown;
  sgstAmount: unknown;
  igstAmount: unknown;
  lines?: Array<{ lineNumber: number }>;
  [key: string]: unknown;
}

/**
 * Temporary GST-only Prisma facade.
 *
 * NOTE: Generated Prisma client in this environment is out-of-sync with GST models,
 * so direct typed delegates (e.g. prisma.gstDocument) are unavailable at compile time.
 * This facade narrows `unknown` into an explicit GST contract so all GST service calls
 * remain strongly-structured and easy to swap to native Prisma typings after regeneration.
 */
export interface GstPrismaClient {
  gstSettings: {
    findUnique: (args: unknown) => Promise<GstSettingsRecord | null>;
    findFirst: (args: unknown) => Promise<GstSettingsRecord | null>;
    findMany: (args: unknown) => Promise<Array<Pick<GstSettingsRecord, "id" | "gstin">>>;
    upsert: (args: unknown) => Promise<GstSettingsRecord>;
    updateMany: (args: unknown) => Promise<{ count: number }>;
  };
  gstCounter: {
    upsert: (args: unknown) => Promise<GstCounterRecord>;
    update: (args: unknown) => Promise<GstCounterRecord>;
  };
  gstDocument: {
    create: (args: unknown) => Promise<GstDocumentRecord>;
    findUnique: (args: unknown) => Promise<GstDocumentRecord | null>;
    findMany: (args: unknown) => Promise<GstDocumentRecord[]>;
  };
  gstDocumentLine: {
    createMany: (args: unknown) => Promise<{ count: number }>;
  };
  gstExport: {
    create: (args: unknown) => Promise<{ id: string; exportType: string; status: string }>;
  };
  gstExportItem: {
    createMany: (args: unknown) => Promise<{ count: number }>;
  };
  $transaction: <T>(fn: (tx: GstPrismaClient) => Promise<T>) => Promise<T>;
}

export const gstDb = prisma as unknown as GstPrismaClient;
