/*
  Warnings:

  - You are about to drop the column `communityID` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `Community` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserSubscribedCommunities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Community" DROP CONSTRAINT "Community_userID_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_communityID_fkey";

-- DropForeignKey
ALTER TABLE "_UserSubscribedCommunities" DROP CONSTRAINT "_UserSubscribedCommunities_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserSubscribedCommunities" DROP CONSTRAINT "_UserSubscribedCommunities_B_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "communityID",
ADD COLUMN     "community" TEXT[];

-- DropTable
DROP TABLE "Community";

-- DropTable
DROP TABLE "_UserSubscribedCommunities";
