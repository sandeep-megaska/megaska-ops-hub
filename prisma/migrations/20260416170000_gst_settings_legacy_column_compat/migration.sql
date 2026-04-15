-- GST-only additive compatibility fix for legacy GstSettings table shape.
-- Some environments were bootstrapped with extra NOT NULL columns not present in Prisma schema/service writes.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstSettings' AND column_name = 'addressLine1'
  ) THEN
    EXECUTE 'ALTER TABLE "GstSettings" ALTER COLUMN "addressLine1" DROP NOT NULL';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstSettings' AND column_name = 'city'
  ) THEN
    EXECUTE 'ALTER TABLE "GstSettings" ALTER COLUMN "city" DROP NOT NULL';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstSettings' AND column_name = 'state'
  ) THEN
    EXECUTE 'ALTER TABLE "GstSettings" ALTER COLUMN "state" DROP NOT NULL';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'GstSettings' AND column_name = 'postalCode'
  ) THEN
    EXECUTE 'ALTER TABLE "GstSettings" ALTER COLUMN "postalCode" DROP NOT NULL';
  END IF;
END $$;
