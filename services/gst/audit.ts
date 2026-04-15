import type { GstAuditAction, GstAuditActorType } from "./constants";
import { gstDb } from "./db";

export interface GstAuditActor {
  actorType: GstAuditActorType;
  actorId?: string | null;
}

export interface GstAuditEvent {
  action: GstAuditAction;
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
