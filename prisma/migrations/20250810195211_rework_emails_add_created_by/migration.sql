/*
  Warnings:

  - You are about to drop the `EmailSend` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."EmailSend" DROP CONSTRAINT "EmailSend_subscriberId_fkey";

-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "createdBy" TEXT NOT NULL DEFAULT 'newsletter-app',
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT 'newsletter-app';

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "createdBy" TEXT NOT NULL DEFAULT 'newsletter-app',
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT 'newsletter-app';

-- DropTable
DROP TABLE "public"."EmailSend";
