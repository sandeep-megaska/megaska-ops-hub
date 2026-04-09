-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('EXCHANGE', 'REFUND', 'CANCELLATION', 'ISSUE');

-- CreateEnum
CREATE TYPE "ExchangeRequestStatus" AS ENUM ('OPEN', 'AWAITING_PAYMENT', 'PAYMENT_RECEIVED', 'PICKUP_PENDING', 'PICKUP_SCHEDULED', 'PICKUP_COMPLETED', 'ITEM_RECEIVED', 'APPROVED', 'REJECTED', 'REPLACEMENT_PROCESSING', 'REPLACEMENT_SHIPPED', 'CLOSED');

-- CreateEnum
CREATE TYPE "PaymentPurpose" AS ENUM ('REVERSE_PICKUP_FEE');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('RAZORPAY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NOT_CREATED', 'PENDING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ShipmentDirection" AS ENUM ('REVERSE_PICKUP', 'FORWARD_REPLACEMENT');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('NOT_STARTED', 'PENDING', 'SCHEDULED', 'IN_TRANSIT', 'DELIVERED', 'FAILED');

-- CreateTable
CREATE TABLE "OrderActionRequest" (
    "id" TEXT NOT NULL,
    "requestType" "RequestType" NOT NULL DEFAULT 'EXCHANGE',
    "customerProfileId" TEXT NOT NULL,
    "shopifyCustomerId" TEXT,
    "shopifyOrderId" TEXT,
    "orderNumber" TEXT NOT NULL,
    "status" "ExchangeRequestStatus" NOT NULL DEFAULT 'OPEN',
    "reason" TEXT,
    "customerNote" TEXT,
    "adminNote" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerNameSnapshot" TEXT,
    "customerPhoneSnapshot" TEXT,
    "customerEmailSnapshot" TEXT,
    "orderAmountSnapshot" TEXT,
    "deliveryDateSnapshot" TIMESTAMP(3),
    "eligibilityDecision" TEXT,
    "eligibilityReason" TEXT,

    CONSTRAINT "OrderActionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderActionItem" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "shopifyLineItemId" TEXT,
    "productTitle" TEXT NOT NULL,
    "variantTitle" TEXT,
    "sku" TEXT,
    "currentSize" TEXT,
    "requestedSize" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isClearance" BOOLEAN NOT NULL DEFAULT false,
    "isExcludedCategory" BOOLEAN NOT NULL DEFAULT false,
    "eligibilitySnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderActionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestPayment" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "purpose" "PaymentPurpose" NOT NULL DEFAULT 'REVERSE_PICKUP_FEE',
    "provider" "PaymentProvider" NOT NULL DEFAULT 'RAZORPAY',
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'NOT_CREATED',
    "paymentLinkId" TEXT,
    "paymentLinkUrl" TEXT,
    "providerReferenceId" TEXT,
    "paymentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentTracking" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "direction" "ShipmentDirection" NOT NULL,
    "carrier" TEXT,
    "awb" TEXT,
    "trackingUrl" TEXT,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShipmentTracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderActionRequest_customerProfileId_idx" ON "OrderActionRequest"("customerProfileId");

-- CreateIndex
CREATE INDEX "OrderActionRequest_status_idx" ON "OrderActionRequest"("status");

-- CreateIndex
CREATE INDEX "OrderActionRequest_orderNumber_idx" ON "OrderActionRequest"("orderNumber");

-- CreateIndex
CREATE INDEX "OrderActionItem_requestId_idx" ON "OrderActionItem"("requestId");

-- CreateIndex
CREATE INDEX "RequestPayment_requestId_idx" ON "RequestPayment"("requestId");

-- CreateIndex
CREATE INDEX "RequestPayment_status_idx" ON "RequestPayment"("status");

-- CreateIndex
CREATE INDEX "RequestPayment_paymentLinkId_idx" ON "RequestPayment"("paymentLinkId");

-- CreateIndex
CREATE INDEX "ShipmentTracking_requestId_idx" ON "ShipmentTracking"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "ShipmentTracking_requestId_direction_key" ON "ShipmentTracking"("requestId", "direction");

-- AddForeignKey
ALTER TABLE "OrderActionRequest" ADD CONSTRAINT "OrderActionRequest_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderActionItem" ADD CONSTRAINT "OrderActionItem_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "OrderActionRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestPayment" ADD CONSTRAINT "RequestPayment_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "OrderActionRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentTracking" ADD CONSTRAINT "ShipmentTracking_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "OrderActionRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
