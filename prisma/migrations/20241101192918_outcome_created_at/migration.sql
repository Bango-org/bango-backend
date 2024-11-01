/*
  Warnings:

  - Added the required column `updatedAt` to the `Outcome` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TokenAllocation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Outcome" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TokenAllocation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
