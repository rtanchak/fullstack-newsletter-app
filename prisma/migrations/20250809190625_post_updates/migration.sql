-- AlterEnum
ALTER TYPE "public"."PostStatus" ADD VALUE 'SCHEDULED';

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "author" TEXT NOT NULL DEFAULT 'newsletter-app-editor';
