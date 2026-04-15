-- Additive GST schema reconciliation for environments where GST tables were created with legacy column shapes.
-- This migration intentionally avoids destructive changes and old migration edits.

-- Ensure enum type exists for GstSettings numbering strategy.
DO $$ BEGIN
  CREATE TYPE "GstNumberingStrategy" AS ENUM ('FINANCIAL_YEAR_SEQUENCE', 'CALENDAR_YEAR_SEQUENCE', 'MONTHLY_SEQUENCE', 'MANUAL');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Ensure enum values required by current Prisma schema/code are available.
ALTER TYPE "GstDocumentStatus" ADD VALUE IF NOT EXISTS 'ISSUED';
ALTER TYPE "GstDocumentStatus" ADD VALUE IF NOT EXISTS 'FAILED';
ALTER TYPE "GstSupplyType" ADD VALUE IF NOT EXISTS 'SEZ_WITH_PAYMENT';
ALTER TYPE "GstSupplyType" ADD VALUE IF NOT EXISTS 'SEZ_WITHOUT_PAYMENT';

-- GstSettings: current code depends on these fields.
ALTER TABLE "GstSettings"
  ADD COLUMN IF NOT EXISTS "invoiceNumberStrategy" "GstNumberingStrategy",
  ADD COLUMN IF NOT EXISTS "einvoiceEnabled" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "defaultCurrency" TEXT;

UPDATE "GstSettings"
SET "invoiceNumberStrategy" = COALESCE("invoiceNumberStrategy", 'FINANCIAL_YEAR_SEQUENCE'::"GstNumberingStrategy"),
    "einvoiceEnabled" = COALESCE("einvoiceEnabled", false),
    "defaultCurrency" = COALESCE(NULLIF("defaultCurrency", ''), 'INR')
WHERE "invoiceNumberStrategy" IS NULL
   OR "einvoiceEnabled" IS NULL
   OR "defaultCurrency" IS NULL
   OR "defaultCurrency" = '';

ALTER TABLE "GstSettings"
  ALTER COLUMN "invoiceNumberStrategy" SET DEFAULT 'FINANCIAL_YEAR_SEQUENCE',
  ALTER COLUMN "invoiceNumberStrategy" SET NOT NULL,
  ALTER COLUMN "einvoiceEnabled" SET DEFAULT false,
  ALTER COLUMN "einvoiceEnabled" SET NOT NULL,
  ALTER COLUMN "defaultCurrency" SET DEFAULT 'INR',
  ALTER COLUMN "defaultCurrency" SET NOT NULL;

-- GstCounter compatibility columns used by reserveGstNumber.
ALTER TABLE "GstCounter"
  ADD COLUMN IF NOT EXISTS "gstSettingsId" TEXT,
  ADD COLUMN IF NOT EXISTS "documentType" "GstDocumentType",
  ADD COLUMN IF NOT EXISTS "lastNumber" INTEGER,
  ADD COLUMN IF NOT EXISTS "financialYear" TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstCounter' AND column_name = 'settingsId'
  ) THEN
    EXECUTE 'UPDATE "GstCounter" SET "gstSettingsId" = COALESCE("gstSettingsId", "settingsId") WHERE "gstSettingsId" IS NULL';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstCounter' AND column_name = 'currentValue'
  ) THEN
    EXECUTE 'UPDATE "GstCounter" SET "lastNumber" = COALESCE("lastNumber", "currentValue", 0) WHERE "lastNumber" IS NULL';
  ELSE
    EXECUTE 'UPDATE "GstCounter" SET "lastNumber" = COALESCE("lastNumber", 0) WHERE "lastNumber" IS NULL';
  END IF;
END $$;

ALTER TABLE "GstCounter"
  ALTER COLUMN "lastNumber" SET DEFAULT 0,
  ALTER COLUMN "lastNumber" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "GstCounter_gstSettingsId_documentType_financialYear_key"
  ON "GstCounter"("gstSettingsId", "documentType", "financialYear");
CREATE INDEX IF NOT EXISTS "GstCounter_gstSettingsId_documentType_idx"
  ON "GstCounter"("gstSettingsId", "documentType");

DO $$ BEGIN
  ALTER TABLE "GstCounter"
    ADD CONSTRAINT "GstCounter_gstSettingsId_fkey"
    FOREIGN KEY ("gstSettingsId") REFERENCES "GstSettings"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- GstDocument compatibility columns used by invoice/note/export flows.
ALTER TABLE "GstDocument"
  ADD COLUMN IF NOT EXISTS "gstSettingsId" TEXT,
  ADD COLUMN IF NOT EXISTS "documentDate" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "placeOfSupplyStateCode" TEXT,
  ADD COLUMN IF NOT EXISTS "isInterstate" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "jsonSnapshot" JSONB,
  ADD COLUMN IF NOT EXISTS "metadata" JSONB,
  ADD COLUMN IF NOT EXISTS "sourceOrderId" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceOrderNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceReference" TEXT,
  ADD COLUMN IF NOT EXISTS "shopifyOrderId" TEXT,
  ADD COLUMN IF NOT EXISTS "shopifyOrderName" TEXT,
  ADD COLUMN IF NOT EXISTS "customerProfileId" TEXT,
  ADD COLUMN IF NOT EXISTS "originalDocumentId" TEXT,
  ADD COLUMN IF NOT EXISTS "pdfFileUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "issuedAt" TIMESTAMP(3);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstDocument' AND column_name = 'settingsId'
  ) THEN
    EXECUTE 'UPDATE "GstDocument" SET "gstSettingsId" = COALESCE("gstSettingsId", "settingsId") WHERE "gstSettingsId" IS NULL';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstDocument' AND column_name = 'issueDate'
  ) THEN
    EXECUTE 'UPDATE "GstDocument" SET "documentDate" = COALESCE("documentDate", "issueDate", CURRENT_TIMESTAMP) WHERE "documentDate" IS NULL';
  ELSE
    EXECUTE 'UPDATE "GstDocument" SET "documentDate" = COALESCE("documentDate", CURRENT_TIMESTAMP) WHERE "documentDate" IS NULL';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstDocument' AND column_name = 'placeOfSupply'
  ) THEN
    EXECUTE 'UPDATE "GstDocument" SET "placeOfSupplyStateCode" = COALESCE("placeOfSupplyStateCode", NULLIF("placeOfSupply", '''')) WHERE "placeOfSupplyStateCode" IS NULL';
  END IF;

  EXECUTE 'UPDATE "GstDocument" SET "isInterstate" = COALESCE("isInterstate", false) WHERE "isInterstate" IS NULL';
  EXECUTE 'UPDATE "GstDocument" SET "jsonSnapshot" = COALESCE("jsonSnapshot", ''{}''::jsonb) WHERE "jsonSnapshot" IS NULL';
END $$;

ALTER TABLE "GstDocument"
  ALTER COLUMN "documentDate" SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "documentDate" SET NOT NULL,
  ALTER COLUMN "isInterstate" SET DEFAULT false,
  ALTER COLUMN "isInterstate" SET NOT NULL,
  ALTER COLUMN "jsonSnapshot" SET DEFAULT '{}'::jsonb,
  ALTER COLUMN "jsonSnapshot" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "GstDocument_gstSettingsId_idx" ON "GstDocument"("gstSettingsId");
CREATE INDEX IF NOT EXISTS "GstDocument_sourceOrderId_idx" ON "GstDocument"("sourceOrderId");
CREATE INDEX IF NOT EXISTS "GstDocument_sourceOrderNumber_idx" ON "GstDocument"("sourceOrderNumber");
CREATE INDEX IF NOT EXISTS "GstDocument_originalDocumentId_idx" ON "GstDocument"("originalDocumentId");
CREATE INDEX IF NOT EXISTS "GstDocument_status_documentDate_idx" ON "GstDocument"("status", "documentDate");

DO $$ BEGIN
  ALTER TABLE "GstDocument"
    ADD CONSTRAINT "GstDocument_gstSettingsId_fkey"
    FOREIGN KEY ("gstSettingsId") REFERENCES "GstSettings"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- GstDocumentLine compatibility for createMany and reads.
ALTER TABLE "GstDocumentLine"
  ADD COLUMN IF NOT EXISTS "gstDocumentId" TEXT,
  ADD COLUMN IF NOT EXISTS "discount" DECIMAL(14,2),
  ADD COLUMN IF NOT EXISTS "taxRate" DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS "lineTotal" DECIMAL(14,2);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstDocumentLine' AND column_name = 'documentId'
  ) THEN
    EXECUTE 'UPDATE "GstDocumentLine" SET "gstDocumentId" = COALESCE("gstDocumentId", "documentId") WHERE "gstDocumentId" IS NULL';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstDocumentLine' AND column_name = 'discountAmount'
  ) THEN
    EXECUTE 'UPDATE "GstDocumentLine" SET "discount" = COALESCE("discount", "discountAmount", 0) WHERE "discount" IS NULL';
  ELSE
    EXECUTE 'UPDATE "GstDocumentLine" SET "discount" = COALESCE("discount", 0) WHERE "discount" IS NULL';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstDocumentLine' AND column_name = 'taxRatePercent'
  ) THEN
    EXECUTE 'UPDATE "GstDocumentLine" SET "taxRate" = COALESCE("taxRate", "taxRatePercent", 0) WHERE "taxRate" IS NULL';
  ELSE
    EXECUTE 'UPDATE "GstDocumentLine" SET "taxRate" = COALESCE("taxRate", 0) WHERE "taxRate" IS NULL';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstDocumentLine' AND column_name = 'totalAmount'
  ) THEN
    EXECUTE 'UPDATE "GstDocumentLine" SET "lineTotal" = COALESCE("lineTotal", "totalAmount", 0) WHERE "lineTotal" IS NULL';
  ELSE
    EXECUTE 'UPDATE "GstDocumentLine" SET "lineTotal" = COALESCE("lineTotal", 0) WHERE "lineTotal" IS NULL';
  END IF;
END $$;

ALTER TABLE "GstDocumentLine"
  ALTER COLUMN "discount" SET DEFAULT 0,
  ALTER COLUMN "discount" SET NOT NULL,
  ALTER COLUMN "taxRate" SET DEFAULT 0,
  ALTER COLUMN "taxRate" SET NOT NULL,
  ALTER COLUMN "lineTotal" SET DEFAULT 0,
  ALTER COLUMN "lineTotal" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "GstDocumentLine_gstDocumentId_lineNumber_key"
  ON "GstDocumentLine"("gstDocumentId", "lineNumber");
CREATE INDEX IF NOT EXISTS "GstDocumentLine_gstDocumentId_idx" ON "GstDocumentLine"("gstDocumentId");

DO $$ BEGIN
  ALTER TABLE "GstDocumentLine"
    ADD CONSTRAINT "GstDocumentLine_gstDocumentId_fkey"
    FOREIGN KEY ("gstDocumentId") REFERENCES "GstDocument"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- GstExport compatibility used by export route.
ALTER TABLE "GstExport"
  ADD COLUMN IF NOT EXISTS "gstSettingsId" TEXT,
  ADD COLUMN IF NOT EXISTS "periodStart" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "periodEnd" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "filters" JSONB,
  ADD COLUMN IF NOT EXISTS "generatedByType" TEXT,
  ADD COLUMN IF NOT EXISTS "generatedById" TEXT;

UPDATE "GstExport"
SET "periodStart" = COALESCE("periodStart", "generatedAt", "createdAt"),
    "periodEnd" = COALESCE("periodEnd", "generatedAt", "createdAt")
WHERE "periodStart" IS NULL OR "periodEnd" IS NULL;

CREATE INDEX IF NOT EXISTS "GstExport_gstSettingsId_periodStart_periodEnd_idx"
  ON "GstExport"("gstSettingsId", "periodStart", "periodEnd");
CREATE UNIQUE INDEX IF NOT EXISTS "GstExport_gstSettingsId_exportType_periodStart_periodEnd_key"
  ON "GstExport"("gstSettingsId", "exportType", "periodStart", "periodEnd");

DO $$ BEGIN
  ALTER TABLE "GstExport"
    ADD CONSTRAINT "GstExport_gstSettingsId_fkey"
    FOREIGN KEY ("gstSettingsId") REFERENCES "GstSettings"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- GstExportItem compatibility used by export item writes.
ALTER TABLE "GstExportItem"
  ADD COLUMN IF NOT EXISTS "gstExportId" TEXT,
  ADD COLUMN IF NOT EXISTS "gstDocumentId" TEXT,
  ADD COLUMN IF NOT EXISTS "rowNumber" INTEGER,
  ADD COLUMN IF NOT EXISTS "documentType" "GstDocumentType",
  ADD COLUMN IF NOT EXISTS "documentNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "documentDate" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "status" TEXT,
  ADD COLUMN IF NOT EXISTS "payload" JSONB,
  ADD COLUMN IF NOT EXISTS "errorCode" TEXT,
  ADD COLUMN IF NOT EXISTS "errorMessage" TEXT,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstExportItem' AND column_name = 'exportId'
  ) THEN
    EXECUTE 'UPDATE "GstExportItem" SET "gstExportId" = COALESCE("gstExportId", "exportId") WHERE "gstExportId" IS NULL';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstExportItem' AND column_name = 'documentId'
  ) THEN
    EXECUTE 'UPDATE "GstExportItem" SET "gstDocumentId" = COALESCE("gstDocumentId", "documentId") WHERE "gstDocumentId" IS NULL';
  END IF;

  EXECUTE 'UPDATE "GstExportItem" SET "rowNumber" = COALESCE("rowNumber", 1) WHERE "rowNumber" IS NULL';
  EXECUTE 'UPDATE "GstExportItem" SET "status" = COALESCE(NULLIF("status", ''''), ''READY'') WHERE "status" IS NULL OR "status" = ''''';
  EXECUTE 'UPDATE "GstExportItem" SET "payload" = COALESCE("payload", ''{}''::jsonb) WHERE "payload" IS NULL';
  EXECUTE 'UPDATE "GstExportItem" SET "updatedAt" = COALESCE("updatedAt", "createdAt", CURRENT_TIMESTAMP) WHERE "updatedAt" IS NULL';
END $$;

ALTER TABLE "GstExportItem"
  ALTER COLUMN "rowNumber" SET DEFAULT 1,
  ALTER COLUMN "status" SET DEFAULT 'READY',
  ALTER COLUMN "payload" SET DEFAULT '{}'::jsonb,
  ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS "GstExportItem_gstExportId_rowNumber_key"
  ON "GstExportItem"("gstExportId", "rowNumber");
CREATE INDEX IF NOT EXISTS "GstExportItem_gstDocumentId_idx" ON "GstExportItem"("gstDocumentId");
CREATE INDEX IF NOT EXISTS "GstExportItem_status_idx" ON "GstExportItem"("status");

DO $$ BEGIN
  ALTER TABLE "GstExportItem"
    ADD CONSTRAINT "GstExportItem_gstExportId_fkey"
    FOREIGN KEY ("gstExportId") REFERENCES "GstExport"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "GstExportItem"
    ADD CONSTRAINT "GstExportItem_gstDocumentId_fkey"
    FOREIGN KEY ("gstDocumentId") REFERENCES "GstDocument"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- GstReconciliationRun + GstAuditLog fields used by reconciliation/audit services.
ALTER TABLE "GstReconciliationRun"
  ADD COLUMN IF NOT EXISTS "gstSettingsId" TEXT,
  ADD COLUMN IF NOT EXISTS "periodStart" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "periodEnd" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "sourceSystem" TEXT,
  ADD COLUMN IF NOT EXISTS "matchedCount" INTEGER,
  ADD COLUMN IF NOT EXISTS "mismatchedCount" INTEGER,
  ADD COLUMN IF NOT EXISTS "missingInBooksCount" INTEGER,
  ADD COLUMN IF NOT EXISTS "missingInPortalCount" INTEGER;

UPDATE "GstReconciliationRun"
SET "periodStart" = COALESCE("periodStart", "startedAt", CURRENT_TIMESTAMP),
    "periodEnd" = COALESCE("periodEnd", "completedAt", "startedAt", CURRENT_TIMESTAMP),
    "matchedCount" = COALESCE("matchedCount", 0),
    "mismatchedCount" = COALESCE("mismatchedCount", 0),
    "missingInBooksCount" = COALESCE("missingInBooksCount", 0),
    "missingInPortalCount" = COALESCE("missingInPortalCount", 0)
WHERE "periodStart" IS NULL
   OR "periodEnd" IS NULL
   OR "matchedCount" IS NULL
   OR "mismatchedCount" IS NULL
   OR "missingInBooksCount" IS NULL
   OR "missingInPortalCount" IS NULL;

ALTER TABLE "GstReconciliationRun"
  ALTER COLUMN "matchedCount" SET DEFAULT 0,
  ALTER COLUMN "matchedCount" SET NOT NULL,
  ALTER COLUMN "mismatchedCount" SET DEFAULT 0,
  ALTER COLUMN "mismatchedCount" SET NOT NULL,
  ALTER COLUMN "missingInBooksCount" SET DEFAULT 0,
  ALTER COLUMN "missingInBooksCount" SET NOT NULL,
  ALTER COLUMN "missingInPortalCount" SET DEFAULT 0,
  ALTER COLUMN "missingInPortalCount" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "GstReconciliationRun_gstSettingsId_periodStart_periodEnd_idx"
  ON "GstReconciliationRun"("gstSettingsId", "periodStart", "periodEnd");

DO $$ BEGIN
  ALTER TABLE "GstReconciliationRun"
    ADD CONSTRAINT "GstReconciliationRun_gstSettingsId_fkey"
    FOREIGN KEY ("gstSettingsId") REFERENCES "GstSettings"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "GstAuditLog"
  ADD COLUMN IF NOT EXISTS "gstSettingsId" TEXT,
  ADD COLUMN IF NOT EXISTS "gstDocumentId" TEXT,
  ADD COLUMN IF NOT EXISTS "gstPartyId" TEXT,
  ADD COLUMN IF NOT EXISTS "gstExportId" TEXT,
  ADD COLUMN IF NOT EXISTS "reconciliationRunId" TEXT,
  ADD COLUMN IF NOT EXISTS "previousState" JSONB,
  ADD COLUMN IF NOT EXISTS "nextState" JSONB,
  ADD COLUMN IF NOT EXISTS "metadata" JSONB;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstAuditLog' AND column_name = 'payload'
  ) THEN
    EXECUTE 'UPDATE "GstAuditLog" SET "metadata" = COALESCE("metadata", "payload", ''{}''::jsonb) WHERE "metadata" IS NULL';
  ELSE
    EXECUTE 'UPDATE "GstAuditLog" SET "metadata" = COALESCE("metadata", ''{}''::jsonb) WHERE "metadata" IS NULL';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "GstAuditLog_gstDocumentId_createdAt_idx" ON "GstAuditLog"("gstDocumentId", "createdAt");
CREATE INDEX IF NOT EXISTS "GstAuditLog_gstPartyId_createdAt_idx" ON "GstAuditLog"("gstPartyId", "createdAt");
CREATE INDEX IF NOT EXISTS "GstAuditLog_gstExportId_createdAt_idx" ON "GstAuditLog"("gstExportId", "createdAt");
CREATE INDEX IF NOT EXISTS "GstAuditLog_reconciliationRunId_createdAt_idx" ON "GstAuditLog"("reconciliationRunId", "createdAt");
CREATE INDEX IF NOT EXISTS "GstAuditLog_action_createdAt_idx" ON "GstAuditLog"("action", "createdAt");
