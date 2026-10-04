/*
  Warnings:

  - You are about to drop the column `completed` on the `PnleConcept` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `PnleConcept` table. All the data in the column will be lost.
  - You are about to drop the column `pauseCount` on the `PnleConcept` table. All the data in the column will be lost.
  - You are about to drop the column `remainingSeconds` on the `PnleConcept` table. All the data in the column will be lost.
  - You are about to drop the column `running` on the `PnleConcept` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Streak` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Streak` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeviceToken" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PnleConcept" DROP COLUMN "completed",
DROP COLUMN "completedAt",
DROP COLUMN "pauseCount",
DROP COLUMN "remainingSeconds",
DROP COLUMN "running";

-- AlterTable
ALTER TABLE "Streak" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "googleId" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptProgress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "conceptId" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "remainingSeconds" INTEGER,
    "running" BOOLEAN NOT NULL DEFAULT false,
    "pauseCount" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ConceptProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "ConceptProgress_userId_conceptId_key" ON "ConceptProgress"("userId", "conceptId");

-- CreateIndex
CREATE UNIQUE INDEX "Streak_userId_key" ON "Streak"("userId");

-- AddForeignKey
ALTER TABLE "ConceptProgress" ADD CONSTRAINT "ConceptProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptProgress" ADD CONSTRAINT "ConceptProgress_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "PnleConcept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Streak" ADD CONSTRAINT "Streak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceToken" ADD CONSTRAINT "DeviceToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
