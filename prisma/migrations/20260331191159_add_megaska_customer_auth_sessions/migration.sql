-- CreateTable
CREATE TABLE "MegaskaCustomerAuthSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionTokenHash" TEXT NOT NULL,
    "phoneE164" TEXT NOT NULL,
    "customerProfileId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MegaskaCustomerAuthSession_customerProfileId_fkey"
      FOREIGN KEY ("customerProfileId") REFERENCES "MegaskaCustomerProfile" ("id")
      ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MegaskaCustomerAuthSession_sessionTokenHash_key"
ON "MegaskaCustomerAuthSession"("sessionTokenHash");

-- CreateIndex
CREATE INDEX "MegaskaCustomerAuthSession_phoneE164_idx"
ON "MegaskaCustomerAuthSession"("phoneE164");

-- CreateIndex
CREATE INDEX "MegaskaCustomerAuthSession_customerProfileId_idx"
ON "MegaskaCustomerAuthSession"("customerProfileId");

-- CreateIndex
CREATE INDEX "MegaskaCustomerAuthSession_expiresAt_idx"
ON "MegaskaCustomerAuthSession"("expiresAt");

-- CreateIndex
CREATE INDEX "MegaskaCustomerAuthSession_revokedAt_idx"
ON "MegaskaCustomerAuthSession"("revokedAt");