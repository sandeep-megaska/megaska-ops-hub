-- Ensure legacy GstCounter layouts can be used by current reserveGstNumber flow.
-- This migration is additive and GST-scoped.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstCounter' AND column_name = 'scope'
  ) THEN
    UPDATE "GstCounter"
    SET "documentType" = CASE UPPER(COALESCE("scope", ''))
      WHEN 'INVOICE' THEN 'TAX_INVOICE'::"GstDocumentType"
      WHEN 'TAX_INVOICE' THEN 'TAX_INVOICE'::"GstDocumentType"
      WHEN 'CREDIT_NOTE' THEN 'CREDIT_NOTE'::"GstDocumentType"
      WHEN 'DEBIT_NOTE' THEN 'DEBIT_NOTE'::"GstDocumentType"
      ELSE "documentType"
    END
    WHERE "documentType" IS NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstCounter' AND column_name = 'settingsId'
  ) THEN
    UPDATE "GstCounter"
    SET "gstSettingsId" = COALESCE("gstSettingsId", "settingsId")
    WHERE "gstSettingsId" IS NULL;
  END IF;
END $$;

ALTER TABLE "GstCounter"
  ALTER COLUMN "gstSettingsId" SET NOT NULL,
  ALTER COLUMN "documentType" SET NOT NULL,
  ALTER COLUMN "financialYear" SET NOT NULL;

-- Legacy columns are optional in reconciled schema. Allow current code to initialize fresh rows safely.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstCounter' AND column_name = 'settingsId'
  ) THEN
    ALTER TABLE "GstCounter"
      ALTER COLUMN "settingsId" DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstCounter' AND column_name = 'scope'
  ) THEN
    ALTER TABLE "GstCounter"
      ALTER COLUMN "scope" DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstCounter' AND column_name = 'prefix'
  ) THEN
    ALTER TABLE "GstCounter"
      ALTER COLUMN "prefix" DROP NOT NULL;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "GstCounter_gstSettingsId_documentType_financialYear_key"
  ON "GstCounter"("gstSettingsId", "documentType", "financialYear");
