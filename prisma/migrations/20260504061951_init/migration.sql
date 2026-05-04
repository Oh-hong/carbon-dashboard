-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ELECTRICITY', 'RAW_MATERIAL', 'TRANSPORT');

-- CreateTable
CREATE TABLE "emission_factors" (
    "id" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emission_factors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emission_factor_versions" (
    "id" TEXT NOT NULL,
    "emissionFactorId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "emission_factor_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "category" "Category" NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "scope" INTEGER NOT NULL,
    "emissionFactorId" TEXT,
    "calculatedEmission" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "emission_factors_category_name_key" ON "emission_factors"("category", "name");

-- AddForeignKey
ALTER TABLE "emission_factor_versions" ADD CONSTRAINT "emission_factor_versions_emissionFactorId_fkey" FOREIGN KEY ("emissionFactorId") REFERENCES "emission_factors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_emissionFactorId_fkey" FOREIGN KEY ("emissionFactorId") REFERENCES "emission_factors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
