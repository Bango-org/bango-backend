/*
  Warnings:

  - You are about to drop the column `option` on the `Trade` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_eventID_fkey";

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "option",
ADD COLUMN     "outcomeId" INTEGER,
ALTER COLUMN "order_size" SET DEFAULT 0,
ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "eventID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE SET NULL ON UPDATE CASCADE;
