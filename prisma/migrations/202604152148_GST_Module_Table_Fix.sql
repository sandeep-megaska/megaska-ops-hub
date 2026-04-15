-- Enums
DO $$ BEGIN
  CREATE TYPE "GstDocumentType" AS ENUM ('TAX_INVOICE', 'CREDIT_NOTE', 'DEBIT_NOTE', 'DELIVERY_CHALLAN');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "GstDocumentStatus" AS ENUM ('DRAFT', 'FINALIZED', 'CANCELLED', 'VOID');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "GstPartyType" AS ENUM ('SELLER', 'CUSTOMER', 'CONSIGNEE', 'SHIP_FROM', 'SHIP_TO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "GstSupplyType" AS ENUM ('B2B', 'B2C', 'EXPORT', 'SEZ', 'DEEMED_EXPORT');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "GstTaxRateType" AS ENUM ('NIL', 'ZERO', 'GST_003', 'GST_005', 'GST_012', 'GST_018', 'GST_028');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "GstReconciliationStatus" AS ENUM ('PENDING', 'MATCHED', 'MISMATCH', 'MISSING_IN_SOURCE', 'MISSING_IN_TARGET', 'ERROR');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tables
CREATE TABLE IF NOT EXISTS "GstSettings" (
  "id" TEXT NOT NULL,
  "legalName" TEXT NOT NULL,
  "tradeName" TEXT,
  "gstin" TEXT NOT NULL,
  "pan" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "addressLine1" TEXT NOT NULL,
  "addressLine2" TEXT,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "stateCode" TEXT NOT NULL,
  "postalCode" TEXT NOT NULL,
  "country" TEXT NOT NULL DEFAULT 'IN',
  "invoicePrefix" TEXT NOT NULL DEFAULT 'GST',
  "creditNotePrefix" TEXT NOT NULL DEFAULT 'CN',
  "debitNotePrefix" TEXT NOT NULL DEFAULT 'DN',
  "invoiceSequencePadding" INTEGER NOT NULL DEFAULT 6,
  "financialYearStartMonth" INTEGER NOT NULL DEFAULT 4,
  "defaultPlaceOfSupply" TEXT,
  "defaultCurrency" TEXT NOT NULL DEFAULT 'INR',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GstSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GstCounter" (
  "id" TEXT NOT NULL,
  "settingsId" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "financialYear" TEXT NOT NULL,
  "currentValue" INTEGER NOT NULL DEFAULT 0,
  "prefix" TEXT NOT NULL,
  "padding" INTEGER NOT NULL DEFAULT 6,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GstCounter_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GstParty" (
  "id" TEXT NOT NULL,
  "type" "GstPartyType" NOT NULL,
  "name" TEXT NOT NULL,
  "gstin" TEXT,
  "pan" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "addressLine1" TEXT NOT NULL,
  "addressLine2" TEXT,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "stateCode" TEXT NOT NULL,
  "postalCode" TEXT NOT NULL,
  "country" TEXT NOT NULL DEFAULT 'IN',
  "placeOfSupply" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GstParty_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GstDocument" (
  "id" TEXT NOT NULL,
  "settingsId" TEXT NOT NULL,
  "documentType" "GstDocumentType" NOT NULL,
  "status" "GstDocumentStatus" NOT NULL DEFAULT 'DRAFT',
  "documentNumber" TEXT,
  "sequenceNumber" INTEGER,
  "financialYear" TEXT,
  "issueDate" TIMESTAMP(3) NOT NULL,
  "supplyDate" TIMESTAMP(3),
  "dueDate" TIMESTAMP(3),
  "currency" TEXT NOT NULL DEFAULT 'INR',
  "supplyType" "GstSupplyType",
  "placeOfSupply" TEXT,
  "reverseCharge" BOOLEAN NOT NULL DEFAULT false,
  "eCommerceGstin" TEXT,
  "sourceOrderId" TEXT,
  "sourceOrderNumber" TEXT,
  "sourceReference" TEXT,
  "sellerPartyId" TEXT,
  "customerPartyId" TEXT,
  "subtotalAmount" DECIMAL(18,2) NOT NULL,
  "discountAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "taxableAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "cgstAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "sgstAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "igstAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "cessAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "roundOffAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "totalAmount" DECIMAL(18,2) NOT NULL,
  "notes" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GstDocument_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GstDocumentLine" (
  "id" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "lineNumber" INTEGER NOT NULL,
  "sku" TEXT,
  "hsnOrSac" TEXT,
  "description" TEXT NOT NULL,
  "quantity" DECIMAL(18,3) NOT NULL DEFAULT 1,
  "unit" TEXT,
  "unitPrice" DECIMAL(18,2) NOT NULL,
  "grossAmount" DECIMAL(18,2) NOT NULL,
  "discountAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "taxableAmount" DECIMAL(18,2) NOT NULL,
  "taxRateType" "GstTaxRateType" NOT NULL,
  "taxRatePercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
  "cgstAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "sgstAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "igstAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "cessAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "totalAmount" DECIMAL(18,2) NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GstDocumentLine_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GstExport" (
  "id" TEXT NOT NULL,
  "exportType" TEXT NOT NULL,
  "periodKey" TEXT NOT NULL,
  "fileName" TEXT,
  "storageKey" TEXT,
  "checksum" TEXT,
  "status" TEXT NOT NULL DEFAULT 'GENERATED',
  "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GstExport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GstExportItem" (
  "id" TEXT NOT NULL,
  "exportId" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GstExportItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GstReconciliationRun" (
  "id" TEXT NOT NULL,
  "runType" TEXT NOT NULL,
  "periodKey" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'COMPLETED',
  "summary" JSONB,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GstReconciliationRun_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GstAuditLog" (
  "id" TEXT NOT NULL,
  "documentId" TEXT,
  "action" TEXT NOT NULL,
  "actorType" TEXT,
  "actorId" TEXT,
  "payload" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GstAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GstLegacyDocument" (
  "id" TEXT NOT NULL,
  "legacySystem" TEXT NOT NULL,
  "legacyDocumentId" TEXT NOT NULL,
  "legacyDocumentNumber" TEXT,
  "documentType" TEXT,
  "rawPayload" JSONB NOT NULL,
  "migratedToDocumentId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GstLegacyDocument_pkey" PRIMARY KEY ("id")
);

-- Unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "GstSettings_gstin_key" ON "GstSettings"("gstin");
CREATE UNIQUE INDEX IF NOT EXISTS "GstCounter_settingsId_scope_financialYear_key" ON "GstCounter"("settingsId", "scope", "financialYear");
CREATE UNIQUE INDEX IF NOT EXISTS "GstDocument_documentNumber_key" ON "GstDocument"("documentNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "GstDocumentLine_documentId_lineNumber_key" ON "GstDocumentLine"("documentId", "lineNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "GstExportItem_exportId_documentId_key" ON "GstExportItem"("exportId", "documentId");
CREATE UNIQUE INDEX IF NOT EXISTS "GstLegacyDocument_legacySystem_legacyDocumentId_key" ON "GstLegacyDocument"("legacySystem", "legacyDocumentId");

-- Non-unique indexes
CREATE INDEX IF NOT EXISTS "GstSettings_isActive_idx" ON "GstSettings"("isActive");
CREATE INDEX IF NOT EXISTS "GstCounter_settingsId_idx" ON "GstCounter"("settingsId");
CREATE INDEX IF NOT EXISTS "GstDocument_settingsId_issueDate_idx" ON "GstDocument"("settingsId", "issueDate");
CREATE INDEX IF NOT EXISTS "GstDocument_documentType_status_idx" ON "GstDocument"("documentType", "status");
CREATE INDEX IF NOT EXISTS "GstDocument_sourceOrderId_idx" ON "GstDocument"("sourceOrderId");
CREATE INDEX IF NOT EXISTS "GstDocument_sourceOrderNumber_idx" ON "GstDocument"("sourceOrderNumber");
CREATE INDEX IF NOT EXISTS "GstDocumentLine_documentId_idx" ON "GstDocumentLine"("documentId");
CREATE INDEX IF NOT EXISTS "GstDocumentLine_sku_idx" ON "GstDocumentLine"("sku");
CREATE INDEX IF NOT EXISTS "GstDocumentLine_hsnOrSac_idx" ON "GstDocumentLine"("hsnOrSac");
CREATE INDEX IF NOT EXISTS "GstExport_exportType_periodKey_idx" ON "GstExport"("exportType", "periodKey");
CREATE INDEX IF NOT EXISTS "GstExportItem_documentId_idx" ON "GstExportItem"("documentId");
CREATE INDEX IF NOT EXISTS "GstReconciliationRun_runType_periodKey_idx" ON "GstReconciliationRun"("runType", "periodKey");
CREATE INDEX IF NOT EXISTS "GstAuditLog_documentId_createdAt_idx" ON "GstAuditLog"("documentId", "createdAt");
CREATE INDEX IF NOT EXISTS "GstAuditLog_action_createdAt_idx" ON "GstAuditLog"("action", "createdAt");
CREATE INDEX IF NOT EXISTS "GstLegacyDocument_migratedToDocumentId_idx" ON "GstLegacyDocument"("migratedToDocumentId");

-- Foreign keys
DO $$ BEGIN
  ALTER TABLE "GstCounter"
    ADD CONSTRAINT "GstCounter_settingsId_fkey"
    FOREIGN KEY ("settingsId") REFERENCES "GstSettings"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "GstDocument"
    ADD CONSTRAINT "GstDocument_settingsId_fkey"
    FOREIGN KEY ("settingsId") REFERENCES "GstSettings"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "GstDocument"
    ADD CONSTRAINT "GstDocument_sellerPartyId_fkey"
    FOREIGN KEY ("sellerPartyId") REFERENCES "GstParty"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "GstDocument"
    ADD CONSTRAINT "GstDocument_customerPartyId_fkey"
    FOREIGN KEY ("customerPartyId") REFERENCES "GstParty"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "GstDocumentLine"
    ADD CONSTRAINT "GstDocumentLine_documentId_fkey"
    FOREIGN KEY ("documentId") REFERENCES "GstDocument"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "GstExportItem"
    ADD CONSTRAINT "GstExportItem_exportId_fkey"
    FOREIGN KEY ("exportId") REFERENCES "GstExport"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "GstExportItem"
    ADD CONSTRAINT "GstExportItem_documentId_fkey"
    FOREIGN KEY ("documentId") REFERENCES "GstDocument"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "GstAuditLog"
    ADD CONSTRAINT "GstAuditLog_documentId_fkey"
    FOREIGN KEY ("documentId") REFERENCES "GstDocument"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
