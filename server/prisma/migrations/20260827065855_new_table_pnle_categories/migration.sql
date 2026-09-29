/*
  Warnings:

  - You are about to drop the `Seller` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Seller";

-- CreateTable
CREATE TABLE "PnleConcept" (
    "id" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,
    "categoryColorHex" TEXT NOT NULL,
    "categoryColorName" TEXT NOT NULL,
    "categoryOrder" INTEGER NOT NULL,
    "groupLabel" TEXT,
    "topicHeader" TEXT NOT NULL,
    "topicOrder" INTEGER NOT NULL,
    "conceptText" TEXT NOT NULL,
    "conceptOrder" INTEGER NOT NULL,
    "allocatedMinutes" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "remainingSeconds" INTEGER,
    "running" BOOLEAN NOT NULL DEFAULT false,
    "pauseCount" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "PnleConcept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "conceptId" INTEGER NOT NULL,
    "originalName" TEXT NOT NULL,
    "storedFilename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Streak" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "lastDate" DATE,

    CONSTRAINT "Streak_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "PnleConcept"("id") ON DELETE CASCADE ON UPDATE CASCADE;
