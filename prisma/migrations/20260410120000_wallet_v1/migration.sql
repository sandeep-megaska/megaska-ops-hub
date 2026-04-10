-- CreateEnum
CREATE TYPE "WalletDirection" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "WalletTransactionType" AS ENUM ('COD_REFUND_CREDIT', 'MANUAL_CREDIT', 'MANUAL_DEBIT', 'ADJUSTMENT', 'GOODWILL_CREDIT');

-- CreateEnum
CREATE TYPE "WalletSourceType" AS ENUM ('ISSUE_REQUEST', 'ADMIN_MANUAL');

-- CreateEnum
CREATE TYPE "WalletActorType" AS ENUM ('SYSTEM', 'ADMIN');

-- CreateTable
CREATE TABLE "WalletAccount" (
    "id" TEXT NOT NULL,
    "customerProfileId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "currentBalance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL,
    "walletAccountId" TEXT NOT NULL,
    "customerProfileId" TEXT NOT NULL,
    "direction" "WalletDirection" NOT NULL,
    "transactionType" "WalletTransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "sourceType" "WalletSourceType" NOT NULL,
    "sourceId" TEXT,
    "sourceReference" TEXT,
    "orderNumber" TEXT,
    "reason" TEXT,
    "adminNote" TEXT,
    "createdByType" "WalletActorType" NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WalletAccount_customerProfileId_currency_key" ON "WalletAccount"("customerProfileId", "currency");

-- CreateIndex
CREATE INDEX "WalletAccount_customerProfileId_idx" ON "WalletAccount"("customerProfileId");

-- CreateIndex
CREATE INDEX "WalletTransaction_customerProfileId_createdAt_idx" ON "WalletTransaction"("customerProfileId", "createdAt");

-- CreateIndex
CREATE INDEX "WalletTransaction_walletAccountId_createdAt_idx" ON "WalletTransaction"("walletAccountId", "createdAt");

-- CreateIndex
CREATE INDEX "WalletTransaction_sourceType_sourceId_idx" ON "WalletTransaction"("sourceType", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "WalletTransaction_sourceType_sourceId_transactionType_key" ON "WalletTransaction"("sourceType", "sourceId", "transactionType");

-- AddForeignKey
ALTER TABLE "WalletAccount" ADD CONSTRAINT "WalletAccount_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_walletAccountId_fkey" FOREIGN KEY ("walletAccountId") REFERENCES "WalletAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
