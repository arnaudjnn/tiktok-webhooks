-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "lastEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);
