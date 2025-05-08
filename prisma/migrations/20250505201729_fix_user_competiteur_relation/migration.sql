/*
  Warnings:

  - You are about to drop the column `userId` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_userId_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "userId";
