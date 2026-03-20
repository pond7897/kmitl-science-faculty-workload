/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[iamId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "firstname_en" TEXT,
ADD COLUMN     "firstname_th" TEXT,
ADD COLUMN     "iamId" TEXT,
ADD COLUMN     "lastname_en" TEXT,
ADD COLUMN     "lastname_th" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_iamId_key" ON "User"("iamId");
