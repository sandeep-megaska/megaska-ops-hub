-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" TEXT,
    "refreshTokenExpires" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MegaskaCustomerProfile" (
    "id" TEXT NOT NULL,
    "phoneE164" TEXT NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "shopifyCustomerId" TEXT,
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MegaskaCustomerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ops_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shop_domain" TEXT NOT NULL,
    "request_no" TEXT,
    "request_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "order_id" TEXT,
    "order_name" TEXT,
    "customer_name" TEXT,
    "customer_email" TEXT,
    "customer_phone" TEXT,
    "reason" TEXT,
    "payload" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "ops_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MegaskaCustomerProfile_phoneE164_key" ON "MegaskaCustomerProfile"("phoneE164");

-- CreateIndex
CREATE UNIQUE INDEX "MegaskaCustomerProfile_shopifyCustomerId_key" ON "MegaskaCustomerProfile"("shopifyCustomerId");

-- CreateIndex
CREATE INDEX "MegaskaCustomerProfile_email_idx" ON "MegaskaCustomerProfile"("email");

-- CreateIndex
CREATE INDEX "ops_requests_shop_created_idx" ON "ops_requests"("shop_domain", "created_at");

-- CreateIndex
CREATE INDEX "ops_requests_status_idx" ON "ops_requests"("status");

-- CreateIndex
CREATE INDEX "ops_requests_type_idx" ON "ops_requests"("request_type");

