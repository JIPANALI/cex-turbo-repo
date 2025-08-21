/*
  Warnings:

  - The `side` column on the `order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."order" DROP COLUMN "side",
ADD COLUMN     "side" TEXT;

-- DropEnum
DROP TYPE "public"."OrderSide";
