-- Phase 1 P0 foundation (additive only): HSN/slabs, mappings, order imports, templates, report runs.

CREATE TYPE "GstProductTaxMapSource" AS ENUM ('MANUAL', 'CSV_IMPORT', 'AUTO_INHERIT');
CREATE TYPE "GstProductTaxMapStatus" AS ENUM ('MAPPED', 'UNMAPPED', 'REVIEW_REQUIRED');
CREATE TYPE "GstOrderImportStatus" AS ENUM ('IMPORTED', 'INVOICE_READY', 'INVOICED', 'NOTE_ISSUED', 'FAILED');
CREATE TYPE "GstOrderEligibilityStatus" AS ENUM ('ELIGIBLE', 'NOT_ELIGIBLE', 'REVIEW_REQUIRED');
CREATE TYPE "GstOrderLineMappingStatus" AS ENUM ('MAPPED', 'UNMAPPED');
CREATE TYPE "GstReportType" AS ENUM ('B2C_SALES_REGISTER', 'NOTE_REGISTER', 'HSN_SUMMARY', 'PERIOD_SUMMARY');
CREATE TYPE "GstReportFormat" AS ENUM ('CSV', 'XLSX');
CREATE TYPE "GstReportRunStatus" AS ENUM ('QUEUED', 'GENERATED', 'FAILED');

CREATE TABLE "GstHsnCode" (
    "id" TEXT NOT NULL,
    "hsnCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isService" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstHsnCode_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GstTaxSlab" (
    "id" TEXT NOT NULL,
    "slabCode" TEXT NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL,
    "cessRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstTaxSlab_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GstHsnSlabMap" (
    "id" TEXT NOT NULL,
    "hsnId" TEXT NOT NULL,
    "slabId" TEXT NOT NULL,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstHsnSlabMap_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GstProductTaxMap" (
    "id" TEXT NOT NULL,
    "shopifyProductId" TEXT NOT NULL,
    "shopifyVariantId" TEXT,
    "hsnId" TEXT NOT NULL,
    "slabId" TEXT NOT NULL,
    "source" "GstProductTaxMapSource" NOT NULL,
    "status" "GstProductTaxMapStatus" NOT NULL,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "lastValidatedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstProductTaxMap_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GstOrderImport" (
    "id" TEXT NOT NULL,
    "gstSettingsId" TEXT NOT NULL,
    "shopifyOrderId" TEXT NOT NULL,
    "shopifyOrderName" TEXT NOT NULL,
    "orderCreatedAt" TIMESTAMP(3) NOT NULL,
    "orderCurrency" TEXT NOT NULL,
    "orderSubtotal" DECIMAL(14,2) NOT NULL,
    "orderTaxTotal" DECIMAL(14,2) NOT NULL,
    "orderGrandTotal" DECIMAL(14,2) NOT NULL,
    "shippingStateCode" TEXT,
    "billingStateCode" TEXT,
    "importStatus" "GstOrderImportStatus" NOT NULL,
    "eligibilityStatus" "GstOrderEligibilityStatus" NOT NULL,
    "readinessErrors" JSONB,
    "snapshot" JSONB NOT NULL,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstOrderImport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GstOrderImportLine" (
    "id" TEXT NOT NULL,
    "gstOrderImportId" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "shopifyLineItemId" TEXT,
    "shopifyProductId" TEXT,
    "shopifyVariantId" TEXT,
    "title" TEXT NOT NULL,
    "sku" TEXT,
    "quantity" DECIMAL(14,3) NOT NULL,
    "unitPrice" DECIMAL(14,2) NOT NULL,
    "discount" DECIMAL(14,2) NOT NULL,
    "taxableAmount" DECIMAL(14,2) NOT NULL,
    "mappedHsnCode" TEXT,
    "mappedTaxRate" DECIMAL(5,2),
    "mappedCessRate" DECIMAL(5,2),
    "mappingStatus" "GstOrderLineMappingStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstOrderImportLine_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GstInvoiceTemplate" (
    "id" TEXT NOT NULL,
    "gstSettingsId" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "headerText" TEXT,
    "footerText" TEXT,
    "declarationText" TEXT,
    "notesText" TEXT,
    "logoFileUrl" TEXT,
    "themeConfig" JSONB,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstInvoiceTemplate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GstReportRun" (
    "id" TEXT NOT NULL,
    "gstSettingsId" TEXT NOT NULL,
    "reportType" "GstReportType" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "format" "GstReportFormat" NOT NULL,
    "status" "GstReportRunStatus" NOT NULL,
    "filters" JSONB,
    "fileUrl" TEXT,
    "checksum" TEXT,
    "rowCount" INTEGER NOT NULL,
    "generatedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GstReportRun_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GstHsnCode_hsnCode_key" ON "GstHsnCode"("hsnCode");
CREATE INDEX "GstHsnCode_hsnCode_isActive_idx" ON "GstHsnCode"("hsnCode", "isActive");

CREATE UNIQUE INDEX "GstTaxSlab_slabCode_key" ON "GstTaxSlab"("slabCode");
CREATE INDEX "GstTaxSlab_slabCode_isActive_idx" ON "GstTaxSlab"("slabCode", "isActive");

CREATE INDEX "GstHsnSlabMap_hsnId_effectiveFrom_effectiveTo_idx" ON "GstHsnSlabMap"("hsnId", "effectiveFrom", "effectiveTo");
CREATE INDEX "GstHsnSlabMap_slabId_effectiveFrom_effectiveTo_idx" ON "GstHsnSlabMap"("slabId", "effectiveFrom", "effectiveTo");
CREATE UNIQUE INDEX "GstHsnSlabMap_hsnId_slabId_effectiveFrom_effectiveTo_key" ON "GstHsnSlabMap"("hsnId", "slabId", "effectiveFrom", "effectiveTo");

CREATE UNIQUE INDEX "GstProductTaxMap_shopifyVariantId_key" ON "GstProductTaxMap"("shopifyVariantId");
CREATE UNIQUE INDEX "GstProductTaxMap_shopifyProductId_shopifyVariantId_key" ON "GstProductTaxMap"("shopifyProductId", "shopifyVariantId");
CREATE INDEX "GstProductTaxMap_shopifyProductId_idx" ON "GstProductTaxMap"("shopifyProductId");
CREATE INDEX "GstProductTaxMap_shopifyVariantId_idx" ON "GstProductTaxMap"("shopifyVariantId");

CREATE UNIQUE INDEX "GstOrderImport_shopifyOrderId_key" ON "GstOrderImport"("shopifyOrderId");
CREATE INDEX "GstOrderImport_gstSettingsId_importStatus_idx" ON "GstOrderImport"("gstSettingsId", "importStatus");
CREATE INDEX "GstOrderImport_shopifyOrderName_idx" ON "GstOrderImport"("shopifyOrderName");
CREATE INDEX "GstOrderImport_orderCreatedAt_idx" ON "GstOrderImport"("orderCreatedAt");

CREATE UNIQUE INDEX "GstOrderImportLine_gstOrderImportId_lineNumber_key" ON "GstOrderImportLine"("gstOrderImportId", "lineNumber");
CREATE INDEX "GstOrderImportLine_shopifyLineItemId_idx" ON "GstOrderImportLine"("shopifyLineItemId");
CREATE INDEX "GstOrderImportLine_shopifyProductId_shopifyVariantId_idx" ON "GstOrderImportLine"("shopifyProductId", "shopifyVariantId");

CREATE INDEX "GstInvoiceTemplate_gstSettingsId_isActive_idx" ON "GstInvoiceTemplate"("gstSettingsId", "isActive");
CREATE INDEX "GstInvoiceTemplate_gstSettingsId_isDefault_idx" ON "GstInvoiceTemplate"("gstSettingsId", "isDefault");

CREATE INDEX "GstReportRun_gstSettingsId_reportType_periodStart_periodEnd_idx" ON "GstReportRun"("gstSettingsId", "reportType", "periodStart", "periodEnd");
CREATE INDEX "GstReportRun_status_createdAt_idx" ON "GstReportRun"("status", "createdAt");

ALTER TABLE "GstHsnSlabMap" ADD CONSTRAINT "GstHsnSlabMap_hsnId_fkey" FOREIGN KEY ("hsnId") REFERENCES "GstHsnCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GstHsnSlabMap" ADD CONSTRAINT "GstHsnSlabMap_slabId_fkey" FOREIGN KEY ("slabId") REFERENCES "GstTaxSlab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GstProductTaxMap" ADD CONSTRAINT "GstProductTaxMap_hsnId_fkey" FOREIGN KEY ("hsnId") REFERENCES "GstHsnCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "GstProductTaxMap" ADD CONSTRAINT "GstProductTaxMap_slabId_fkey" FOREIGN KEY ("slabId") REFERENCES "GstTaxSlab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "GstOrderImport" ADD CONSTRAINT "GstOrderImport_gstSettingsId_fkey" FOREIGN KEY ("gstSettingsId") REFERENCES "GstSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GstOrderImportLine" ADD CONSTRAINT "GstOrderImportLine_gstOrderImportId_fkey" FOREIGN KEY ("gstOrderImportId") REFERENCES "GstOrderImport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GstInvoiceTemplate" ADD CONSTRAINT "GstInvoiceTemplate_gstSettingsId_fkey" FOREIGN KEY ("gstSettingsId") REFERENCES "GstSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GstReportRun" ADD CONSTRAINT "GstReportRun_gstSettingsId_fkey" FOREIGN KEY ("gstSettingsId") REFERENCES "GstSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
