/*
  Warnings:

  - You are about to drop the column `option_a` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `option_b` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "option_a",
DROP COLUMN "option_b";

-- CreateTable
CREATE TABLE "Outcome" (
    "id" SERIAL NOT NULL,
    "outcome_title" TEXT NOT NULL,
    "current_supply" INTEGER NOT NULL DEFAULT 0,
    "total_liquidity" INTEGER NOT NULL DEFAULT 0,
    "eventID" INTEGER NOT NULL,

    CONSTRAINT "Outcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenAllocation" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "outcomeId" INTEGER NOT NULL,

    CONSTRAINT "TokenAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TokenAllocation_userId_outcomeId_key" ON "TokenAllocation"("userId", "outcomeId");

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenAllocation" ADD CONSTRAINT "TokenAllocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenAllocation" ADD CONSTRAINT "TokenAllocation_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
