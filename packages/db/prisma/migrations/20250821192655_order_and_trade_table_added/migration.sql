-- CreateEnum
CREATE TYPE "public"."OrderSide" AS ENUM ('BUY', 'SELL');

-- CreateTable
CREATE TABLE "public"."trade" (
    "id" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "price" DECIMAL(38,18) NOT NULL,
    "quantity" DECIMAL(38,18) NOT NULL,
    "quoteQuantity" DECIMAL(38,18) NOT NULL,
    "isBuyerMaker" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order" (
    "id" TEXT NOT NULL,
    "market" TEXT,
    "price" DECIMAL(38,18),
    "quantity" DECIMAL(38,18),
    "executedQty" DECIMAL(38,18),
    "side" "public"."OrderSide",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trade_market_timestamp_idx" ON "public"."trade"("market", "timestamp");

-- CreateIndex
CREATE INDEX "order_market_idx" ON "public"."order"("market");
