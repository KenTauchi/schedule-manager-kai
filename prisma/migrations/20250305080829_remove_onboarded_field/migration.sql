/*
  Warnings:

  - You are about to drop the column `onBoarded` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "onBoarded";
