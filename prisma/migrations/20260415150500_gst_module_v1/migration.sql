-- CreateEnum
CREATE TYPE "GstDocumentType" AS ENUM ('TAX_INVOICE', 'CREDIT_NOTE', 'DEBIT_NOTE');

-- CreateEnum
CREATE TYPE "GstDocumentStatus" AS ENUM ('DRAFT', 'ISSUED', 'CANCELLED', 'VOID', 'FAILED');

-- CreateEnum
CREATE TYPE "GstNumberingStrategy" AS ENUM ('FINANCIAL_YEAR_SEQUENCE', 'CALENDAR_YEAR_SEQUENCE', 'MONTHLY_SEQUENCE', 'MANUAL');

-- CreateEnum
CREATE TYPE "GstSupplyType" AS ENUM ('B2B', 'B2C', 'EXPORT', 'SEZ_WITH_PAYMENT', 'SEZ_WITHOUT_PAYMENT', 'DEEMED_EXPORT');

-- CreateTable
CREATE TABLE "GstSettings" (
    "id" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "tradeName" TEXT,
    "gstin" TEXT NOT NULL,
    "pan" TEXT,
    "stateCode" TEXT NOT NULL,
    "invoicePrefix" TEXT NOT NULL,
    "creditNotePrefix" TEXT NOT NULL,
    "debitNotePrefix" TEXT NOT NULL,
    "invoiceNumberStrategy" "GstNumberingStrategy" NOT NULL,
    "defaultCurrency" TEXT NOT NULL DEFAULT 'INR',
    "einvoiceEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GstCounter" (
    "id" TEXT NOT NULL,
    "gstSettingsId" TEXT NOT NULL,
    "documentType" "GstDocumentType" NOT NULL,
    "financialYear" TEXT NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstCounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GstDocument" (
    "id" TEXT NOT NULL,
    "documentType" "GstDocumentType" NOT NULL,
    "status" "GstDocumentStatus" NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "documentDate" TIMESTAMP(3) NOT NULL,
    "gstSettingsId" TEXT NOT NULL,
    "shopifyOrderId" TEXT,
    "shopifyOrderName" TEXT,
    "customerProfileId" TEXT,
    "originalDocumentId" TEXT,
    "supplyType" "GstSupplyType" NOT NULL,
    "placeOfSupplyStateCode" TEXT NOT NULL,
    "isInterstate" BOOLEAN NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "taxableAmount" DECIMAL(14,2) NOT NULL,
    "cgstAmount" DECIMAL(14,2) NOT NULL,
    "sgstAmount" DECIMAL(14,2) NOT NULL,
    "igstAmount" DECIMAL(14,2) NOT NULL,
    "cessAmount" DECIMAL(14,2) NOT NULL,
    "totalAmount" DECIMAL(14,2) NOT NULL,
    "pdfFileUrl" TEXT,
    "jsonSnapshot" JSONB NOT NULL,
    "issuedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GstDocumentLine" (
    "id" TEXT NOT NULL,
    "gstDocumentId" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "hsnOrSac" TEXT,
    "quantity" DECIMAL(14,3) NOT NULL,
    "unit" TEXT,
    "unitPrice" DECIMAL(14,2) NOT NULL,
    "discount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "taxableAmount" DECIMAL(14,2) NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL,
    "cgstAmount" DECIMAL(14,2) NOT NULL,
    "sgstAmount" DECIMAL(14,2) NOT NULL,
    "igstAmount" DECIMAL(14,2) NOT NULL,
    "cessAmount" DECIMAL(14,2) NOT NULL,
    "lineTotal" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstDocumentLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GstParty" (
    "id" TEXT NOT NULL,
    "gstin" TEXT,
    "legalName" TEXT NOT NULL,
    "tradeName" TEXT,
    "customerProfileId" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "stateCode" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT 'IN',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GstExport" (
    "id" TEXT NOT NULL,
    "gstSettingsId" TEXT NOT NULL,
    "exportType" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "storageUrl" TEXT,
    "checksum" TEXT,
    "filters" JSONB,
    "generatedByType" TEXT,
    "generatedById" TEXT,
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstExport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GstExportItem" (
    "id" TEXT NOT NULL,
    "gstExportId" TEXT NOT NULL,
    "gstDocumentId" TEXT,
    "rowNumber" INTEGER NOT NULL,
    "documentType" "GstDocumentType",
    "documentNumber" TEXT,
    "documentDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstExportItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GstReconciliationRun" (
    "id" TEXT NOT NULL,
    "gstSettingsId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "sourceSystem" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "matchedCount" INTEGER NOT NULL DEFAULT 0,
    "mismatchedCount" INTEGER NOT NULL DEFAULT 0,
    "missingInBooksCount" INTEGER NOT NULL DEFAULT 0,
    "missingInPortalCount" INTEGER NOT NULL DEFAULT 0,
    "summary" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstReconciliationRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GstAuditLog" (
    "id" TEXT NOT NULL,
    "gstSettingsId" TEXT,
    "gstDocumentId" TEXT,
    "gstPartyId" TEXT,
    "gstExportId" TEXT,
    "reconciliationRunId" TEXT,
    "action" TEXT NOT NULL,
    "actorType" TEXT NOT NULL,
    "actorId" TEXT,
    "previousState" JSONB,
    "nextState" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GstAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GstLegacyDocument" (
    "id" TEXT NOT NULL,
    "sourceSystem" TEXT NOT NULL,
    "legacyDocumentId" TEXT NOT NULL,
    "legacyDocumentNumber" TEXT,
    "documentType" "GstDocumentType",
    "documentStatus" "GstDocumentStatus",
    "gstDocumentId" TEXT,
    "gstPartyId" TEXT,
    "payload" JSONB,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstLegacyDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GstSettings_gstin_key" ON "GstSettings"("gstin");

-- CreateIndex
CREATE UNIQUE INDEX "GstCounter_gstSettingsId_documentType_financialYear_key" ON "GstCounter"("gstSettingsId", "documentType", "financialYear");

-- CreateIndex
CREATE INDEX "GstCounter_gstSettingsId_documentType_idx" ON "GstCounter"("gstSettingsId", "documentType");

-- CreateIndex
CREATE UNIQUE INDEX "GstDocument_documentNumber_key" ON "GstDocument"("documentNumber");

-- CreateIndex
CREATE INDEX "GstDocument_gstSettingsId_idx" ON "GstDocument"("gstSettingsId");

-- CreateIndex
CREATE INDEX "GstDocument_customerProfileId_idx" ON "GstDocument"("customerProfileId");

-- CreateIndex
CREATE INDEX "GstDocument_originalDocumentId_idx" ON "GstDocument"("originalDocumentId");

-- CreateIndex
CREATE INDEX "GstDocument_status_documentDate_idx" ON "GstDocument"("status", "documentDate");

-- CreateIndex
CREATE UNIQUE INDEX "GstDocumentLine_gstDocumentId_lineNumber_key" ON "GstDocumentLine"("gstDocumentId", "lineNumber");

-- CreateIndex
CREATE INDEX "GstDocumentLine_gstDocumentId_idx" ON "GstDocumentLine"("gstDocumentId");

-- CreateIndex
CREATE UNIQUE INDEX "GstParty_gstin_key" ON "GstParty"("gstin");

-- CreateIndex
CREATE INDEX "GstParty_customerProfileId_idx" ON "GstParty"("customerProfileId");

-- CreateIndex
CREATE INDEX "GstParty_legalName_idx" ON "GstParty"("legalName");

-- CreateIndex
CREATE INDEX "GstExport_gstSettingsId_periodStart_periodEnd_idx" ON "GstExport"("gstSettingsId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "GstExport_status_createdAt_idx" ON "GstExport"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "GstExport_gstSettingsId_exportType_periodStart_periodEnd_key" ON "GstExport"("gstSettingsId", "exportType", "periodStart", "periodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "GstExportItem_gstExportId_rowNumber_key" ON "GstExportItem"("gstExportId", "rowNumber");

-- CreateIndex
CREATE INDEX "GstExportItem_gstDocumentId_idx" ON "GstExportItem"("gstDocumentId");

-- CreateIndex
CREATE INDEX "GstExportItem_status_idx" ON "GstExportItem"("status");

-- CreateIndex
CREATE INDEX "GstExportItem_documentType_documentDate_idx" ON "GstExportItem"("documentType", "documentDate");

-- CreateIndex
CREATE INDEX "GstReconciliationRun_gstSettingsId_periodStart_periodEnd_idx" ON "GstReconciliationRun"("gstSettingsId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "GstReconciliationRun_status_startedAt_idx" ON "GstReconciliationRun"("status", "startedAt");

-- CreateIndex
CREATE INDEX "GstAuditLog_gstDocumentId_createdAt_idx" ON "GstAuditLog"("gstDocumentId", "createdAt");

-- CreateIndex
CREATE INDEX "GstAuditLog_gstPartyId_createdAt_idx" ON "GstAuditLog"("gstPartyId", "createdAt");

-- CreateIndex
CREATE INDEX "GstAuditLog_gstExportId_createdAt_idx" ON "GstAuditLog"("gstExportId", "createdAt");

-- CreateIndex
CREATE INDEX "GstAuditLog_reconciliationRunId_createdAt_idx" ON "GstAuditLog"("reconciliationRunId", "createdAt");

-- CreateIndex
CREATE INDEX "GstAuditLog_action_createdAt_idx" ON "GstAuditLog"("action", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "GstLegacyDocument_sourceSystem_legacyDocumentId_key" ON "GstLegacyDocument"("sourceSystem", "legacyDocumentId");

-- CreateIndex
CREATE INDEX "GstLegacyDocument_legacyDocumentNumber_idx" ON "GstLegacyDocument"("legacyDocumentNumber");

-- CreateIndex
CREATE INDEX "GstLegacyDocument_gstDocumentId_idx" ON "GstLegacyDocument"("gstDocumentId");

-- CreateIndex
CREATE INDEX "GstLegacyDocument_gstPartyId_idx" ON "GstLegacyDocument"("gstPartyId");

-- AddForeignKey
ALTER TABLE "GstCounter" ADD CONSTRAINT "GstCounter_gstSettingsId_fkey" FOREIGN KEY ("gstSettingsId") REFERENCES "GstSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GstDocument" ADD CONSTRAINT "GstDocument_gstSettingsId_fkey" FOREIGN KEY ("gstSettingsId") REFERENCES "GstSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GstDocument" ADD CONSTRAINT "GstDocument_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GstDocument" ADD CONSTRAINT "GstDocument_originalDocumentId_fkey" FOREIGN KEY ("originalDocumentId") REFERENCES "GstDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GstDocumentLine" ADD CONSTRAINT "GstDocumentLine_gstDocumentId_fkey" FOREIGN KEY ("gstDocumentId") REFERENCES "GstDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GstParty" ADD CONSTRAINT "GstParty_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GstExport" ADD CONSTRAINT "GstExport_gstSettingsId_fkey" FOREIGN KEY ("gstSettingsId") REFERENCES "GstSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GstExportItem" ADD CONSTRAINT "GstExportItem_gstExportId_fkey" FOREIGN KEY ("gstExportId") REFERENCES "GstExport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GstExportItem" ADD CONSTRAINT "GstExportItem_gstDocumentId_fkey" FOREIGN KEY ("gstDocumentId") REFERENCES "GstDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GstReconciliationRun" ADD CONSTRAINT "GstReconciliationRun_gstSettingsId_fkey" FOREIGN KEY ("gstSettingsId") REFERENCES "GstSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GstAuditLog" ADD CONSTRAINT "GstAuditLog_gstSettingsId_fkey" FOREIGN KEY ("gstSettingsId") REFERENCES "GstSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GstAuditLog" ADD CONSTRAINT "GstAuditLog_gstDocumentId_fkey" FOREIGN KEY ("gstDocumentId") REFERENCES "GstDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GstAuditLog" ADD CONSTRAINT "GstAuditLog_gstPartyId_fkey" FOREIGN KEY ("gstPartyId") REFERENCES "GstParty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GstAuditLog" ADD CONSTRAINT "GstAuditLog_gstExportId_fkey" FOREIGN KEY ("gstExportId") REFERENCES "GstExport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GstAuditLog" ADD CONSTRAINT "GstAuditLog_reconciliationRunId_fkey" FOREIGN KEY ("reconciliationRunId") REFERENCES "GstReconciliationRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GstLegacyDocument" ADD CONSTRAINT "GstLegacyDocument_gstDocumentId_fkey" FOREIGN KEY ("gstDocumentId") REFERENCES "GstDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GstLegacyDocument" ADD CONSTRAINT "GstLegacyDocument_gstPartyId_fkey" FOREIGN KEY ("gstPartyId") REFERENCES "GstParty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
