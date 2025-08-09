-- CreateEnum
CREATE TYPE "public"."JobType" AS ENUM ('POST_PUBLICATION', 'POST_EMAIL_NOTIFICATION');

-- CreateEnum
CREATE TYPE "public"."JobStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- DropIndex
DROP INDEX "public"."Subscriber_active_idx";

-- CreateTable
CREATE TABLE "public"."Job" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "jobType" "public"."JobType" NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."JobStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Job_postId_idx" ON "public"."Job"("postId");

-- CreateIndex
CREATE INDEX "Job_status_scheduledAt_idx" ON "public"."Job"("status", "scheduledAt");

-- CreateIndex
CREATE INDEX "Job_jobType_status_idx" ON "public"."Job"("jobType", "status");

-- CreateIndex
CREATE INDEX "Post_status_publishedAt_idx" ON "public"."Post"("status", "publishedAt");

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
