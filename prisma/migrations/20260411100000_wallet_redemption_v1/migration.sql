-- CreateEnum
CREATE TYPE "WalletReservationStatus" AS ENUM ('ACTIVE', 'CONSUMED', 'RELEASED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "WalletReservationSourceFlow" AS ENUM ('CHECKOUT', 'BUY_NOW');

-- AlterEnum
ALTER TYPE "WalletTransactionType" ADD VALUE IF NOT EXISTS 'CHECKOUT_REDEMPTION';

-- AlterEnum
ALTER TYPE "WalletSourceType" ADD VALUE IF NOT EXISTS 'WALLET_RESERVATION';

-- CreateTable
CREATE TABLE "WalletReservation" (
    "id" TEXT NOT NULL,
    "walletAccountId" TEXT NOT NULL,
    "customerProfileId" TEXT NOT NULL,
    "reservedAmount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "WalletReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "discountCode" TEXT,
    "shopifyDiscountId" TEXT,
    "sourceFlow" "WalletReservationSourceFlow" NOT NULL DEFAULT 'CHECKOUT',
    "cartReference" TEXT,
    "checkoutReference" TEXT,
    "sessionReference" TEXT,
    "orderNumber" TEXT,
    "shopifyOrderId" TEXT,
    "releaseReason" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "WalletReservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WalletReservation_customerProfileId_status_expiresAt_idx" ON "WalletReservation"("customerProfileId", "status", "expiresAt");

-- CreateIndex
CREATE INDEX "WalletReservation_walletAccountId_status_expiresAt_idx" ON "WalletReservation"("walletAccountId", "status", "expiresAt");

-- CreateIndex
CREATE INDEX "WalletReservation_discountCode_idx" ON "WalletReservation"("discountCode");

-- CreateIndex
CREATE INDEX "WalletReservation_shopifyOrderId_idx" ON "WalletReservation"("shopifyOrderId");

-- AddForeignKey
ALTER TABLE "WalletReservation" ADD CONSTRAINT "WalletReservation_walletAccountId_fkey" FOREIGN KEY ("walletAccountId") REFERENCES "WalletAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletReservation" ADD CONSTRAINT "WalletReservation_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
