-- CreateTable
CREATE TABLE "public"."Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "public"."Subscriber"("email");

-- CreateIndex
CREATE INDEX "Subscriber_active_idx" ON "public"."Subscriber"("active");
