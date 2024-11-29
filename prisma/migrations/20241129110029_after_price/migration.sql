/*
  Warnings:

  - You are about to drop the column `price` on the `Trade` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "price",
ADD COLUMN     "afterPrice" INTEGER NOT NULL DEFAULT 0;
