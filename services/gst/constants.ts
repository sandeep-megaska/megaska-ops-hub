export const GST_DOCUMENT_TYPES = ["TAX_INVOICE", "CREDIT_NOTE", "DEBIT_NOTE"] as const;
export const GST_NOTE_DOCUMENT_TYPES = ["CREDIT_NOTE", "DEBIT_NOTE"] as const;

export const GST_DOCUMENT_STATUSES = ["DRAFT", "ISSUED", "CANCELLED", "VOID", "FAILED"] as const;

export const GST_NUMBERING_STRATEGIES = [
  "FINANCIAL_YEAR_SEQUENCE",
  "CALENDAR_YEAR_SEQUENCE",
  "MONTHLY_SEQUENCE",
  "MANUAL",
] as const;

export const GST_SUPPLY_TYPES = [
  "B2B",
  "B2C",
  "EXPORT",
  "SEZ_WITH_PAYMENT",
  "SEZ_WITHOUT_PAYMENT",
  "DEEMED_EXPORT",
] as const;

export const GST_AUDIT_ACTIONS = [
  "GST_SETTINGS_UPSERT",
  "GST_DOCUMENT_DRAFT_CREATED",
  "GST_DOCUMENT_FINALIZED",
  "GST_DOCUMENT_CANCELLED",
  "GST_EXPORT_GENERATED",
  "GST_RECONCILIATION_RUN_CREATED",
] as const;

export const GST_AUDIT_ACTOR_TYPES = ["SYSTEM", "ADMIN", "CUSTOMER"] as const;

export const GST_DEFAULT_DOCUMENT_STATUS = "DRAFT" as const;
export const GST_DEFAULT_NUMBERING_STRATEGY = "FINANCIAL_YEAR_SEQUENCE" as const;
export const GST_DEFAULT_SUPPLY_TYPE = "B2C" as const;
export const GST_DEFAULT_SOURCE_SYSTEM = "MANUAL" as const;

export type GstDocumentType = (typeof GST_DOCUMENT_TYPES)[number];
export type GstNoteDocumentType = (typeof GST_NOTE_DOCUMENT_TYPES)[number];
export type GstDocumentStatus = (typeof GST_DOCUMENT_STATUSES)[number];
export type GstNumberingStrategy = (typeof GST_NUMBERING_STRATEGIES)[number];
export type GstSupplyType = (typeof GST_SUPPLY_TYPES)[number];
export type GstAuditAction = (typeof GST_AUDIT_ACTIONS)[number];
export type GstAuditActorType = (typeof GST_AUDIT_ACTOR_TYPES)[number];

export function isGstSupplyType(value: unknown): value is GstSupplyType {
  return typeof value === "string" && GST_SUPPLY_TYPES.includes(value as GstSupplyType);
}

export function isGstNumberingStrategy(value: unknown): value is GstNumberingStrategy {
  return typeof value === "string" && GST_NUMBERING_STRATEGIES.includes(value as GstNumberingStrategy);
}

export function isGstNoteDocumentType(value: unknown): value is GstNoteDocumentType {
  return typeof value === "string" && GST_NOTE_DOCUMENT_TYPES.includes(value as GstNoteDocumentType);
}
