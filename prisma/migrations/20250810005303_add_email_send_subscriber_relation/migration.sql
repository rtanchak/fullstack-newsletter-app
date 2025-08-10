-- AlterTable
ALTER TABLE "public"."EmailSend" ALTER COLUMN "sentAt" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "EmailSend_subscriberId_idx" ON "public"."EmailSend"("subscriberId");

-- AddForeignKey
ALTER TABLE "public"."EmailSend" ADD CONSTRAINT "EmailSend_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "public"."Subscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
