-- Scope Store Credit wallet accounts by shop while preserving existing LIVE wallet rows.
ALTER TABLE "WalletAccount" ADD COLUMN IF NOT EXISTS "shopId" TEXT;

-- Backfill existing wallet accounts from the owning customer profile when available.
UPDATE "WalletAccount" wa
SET "shopId" = cp."shopId"
FROM "CustomerProfile" cp
WHERE wa."customerProfileId" = cp."id"
  AND wa."shopId" IS NULL
  AND cp."shopId" IS NOT NULL;

-- Replace the legacy cross-shop uniqueness with shop-safe uniqueness.
DROP INDEX IF EXISTS "WalletAccount_customerProfileId_currency_key";
CREATE UNIQUE INDEX IF NOT EXISTS "WalletAccount_shopId_customerProfileId_currency_key"
  ON "WalletAccount"("shopId", "customerProfileId", "currency");

CREATE INDEX IF NOT EXISTS "WalletAccount_shopId_customerProfileId_idx"
  ON "WalletAccount"("shopId", "customerProfileId");

ALTER TABLE "WalletAccount" DROP CONSTRAINT IF EXISTS "WalletAccount_shopId_fkey";
ALTER TABLE "WalletAccount"
  ADD CONSTRAINT "WalletAccount_shopId_fkey"
  FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
