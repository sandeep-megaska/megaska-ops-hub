ALTER TABLE "GstDocument"
  ADD COLUMN IF NOT EXISTS "sourceOrderId" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceOrderNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceReference" TEXT,
  ADD COLUMN IF NOT EXISTS "metadata" JSONB;

CREATE INDEX IF NOT EXISTS "GstDocument_sourceOrderId_idx" ON "GstDocument"("sourceOrderId");
CREATE INDEX IF NOT EXISTS "GstDocument_sourceOrderNumber_idx" ON "GstDocument"("sourceOrderNumber");
