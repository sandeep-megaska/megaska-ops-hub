-- CreateTable
CREATE TABLE "MegaskaCustomerProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phoneE164" TEXT NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "shopifyCustomerId" TEXT,
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MegaskaCustomerProfile_phoneE164_key" ON "MegaskaCustomerProfile"("phoneE164");

-- CreateIndex
CREATE UNIQUE INDEX "MegaskaCustomerProfile_shopifyCustomerId_key" ON "MegaskaCustomerProfile"("shopifyCustomerId");

-- CreateIndex
CREATE INDEX "MegaskaCustomerProfile_email_idx" ON "MegaskaCustomerProfile"("email");
