import { gstDb } from "./db";

export interface GstAuditActor {
  actorType: "SYSTEM" | "ADMIN" | "CUSTOMER";
  actorId?: string | null;
}

export interface GstAuditEvent {
  action:
    | "GST_SETTINGS_UPSERT"
    | "GST_DOCUMENT_DRAFT_CREATED"
    | "GST_DOCUMENT_FINALIZED"
    | "GST_DOCUMENT_CANCELLED"
    | "GST_EXPORT_GENERATED"
    | "GST_RECONCILIATION_RUN_CREATED";
  gstSettingsId?: string | null;
  gstDocumentId?: string | null;
  gstExportId?: string | null;
  reconciliationRunId?: string | null;
  previousState?: unknown;
  nextState?: unknown;
  metadata?: unknown;
}

export async function writeGstAuditLog(event: GstAuditEvent, actor: GstAuditActor): Promise<void> {
  try {
    await gstDb.gstAuditLog.create({
      data: {
        action: event.action,
        actorType: actor.actorType,
        actorId: actor.actorId || null,
        gstSettingsId: event.gstSettingsId || null,
        gstDocumentId: event.gstDocumentId || null,
        gstExportId: event.gstExportId || null,
        reconciliationRunId: event.reconciliationRunId || null,
        previousState: event.previousState ?? null,
        nextState: event.nextState ?? null,
        metadata: event.metadata ?? {},
      },
    });
  } catch (error) {
    console.error("[GST AUDIT] writeGstAuditLog failed", {
      action: event.action,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
