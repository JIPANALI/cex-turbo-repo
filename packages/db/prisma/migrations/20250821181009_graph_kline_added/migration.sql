-- CreateTable
CREATE TABLE "public"."klines_1m" (
    "id" BIGSERIAL NOT NULL,
    "market" TEXT NOT NULL,
    "bucket" TIMESTAMP(3) NOT NULL,
    "start" TIMESTAMP(3),
    "open" DECIMAL(65,30) NOT NULL,
    "high" DECIMAL(65,30) NOT NULL,
    "low" DECIMAL(65,30) NOT NULL,
    "close" DECIMAL(65,30) NOT NULL,
    "volume" DECIMAL(65,30) NOT NULL,
    "quoteVolume" DECIMAL(65,30) NOT NULL,
    "trades" INTEGER NOT NULL,

    CONSTRAINT "klines_1m_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."klines_1h" (
    "id" BIGSERIAL NOT NULL,
    "market" TEXT NOT NULL,
    "bucket" TIMESTAMP(3) NOT NULL,
    "start" TIMESTAMP(3),
    "open" DECIMAL(65,30) NOT NULL,
    "high" DECIMAL(65,30) NOT NULL,
    "low" DECIMAL(65,30) NOT NULL,
    "close" DECIMAL(65,30) NOT NULL,
    "volume" DECIMAL(65,30) NOT NULL,
    "quoteVolume" DECIMAL(65,30) NOT NULL,
    "trades" INTEGER NOT NULL,

    CONSTRAINT "klines_1h_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."klines_1w" (
    "id" BIGSERIAL NOT NULL,
    "market" TEXT NOT NULL,
    "bucket" TIMESTAMP(3) NOT NULL,
    "start" TIMESTAMP(3),
    "open" DECIMAL(65,30) NOT NULL,
    "high" DECIMAL(65,30) NOT NULL,
    "low" DECIMAL(65,30) NOT NULL,
    "close" DECIMAL(65,30) NOT NULL,
    "volume" DECIMAL(65,30) NOT NULL,
    "quoteVolume" DECIMAL(65,30) NOT NULL,
    "trades" INTEGER NOT NULL,

    CONSTRAINT "klines_1w_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "klines_1m_market_bucket_idx" ON "public"."klines_1m"("market", "bucket");

-- CreateIndex
CREATE INDEX "klines_1h_market_bucket_idx" ON "public"."klines_1h"("market", "bucket");

-- CreateIndex
CREATE INDEX "klines_1w_market_bucket_idx" ON "public"."klines_1w"("market", "bucket");
