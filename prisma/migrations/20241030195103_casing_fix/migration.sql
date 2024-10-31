/*
  Warnings:

  - You are about to drop the column `optionA` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `optionB` on the `Event` table. All the data in the column will be lost.
  - Added the required column `option_a` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option_b` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "optionA",
DROP COLUMN "optionB",
ADD COLUMN     "option_a" TEXT NOT NULL,
ADD COLUMN     "option_b" TEXT NOT NULL;
