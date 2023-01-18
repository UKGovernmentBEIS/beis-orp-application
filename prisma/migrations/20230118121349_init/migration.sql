-- CreateTable
CREATE TABLE "Regulator" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Regulator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "key" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresDate" TIMESTAMP(3),
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "regulatorId" TEXT,
    "userId" TEXT,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "regulatorId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Regulator_domain_key" ON "Regulator"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "Regulator_name_key" ON "Regulator"("name");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_regulatorId_fkey" FOREIGN KEY ("regulatorId") REFERENCES "Regulator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_regulatorId_fkey" FOREIGN KEY ("regulatorId") REFERENCES "Regulator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
