/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `competiteur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `competiteur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "competiteur" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "competiteur_email_key" ON "competiteur"("email");
