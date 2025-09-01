-- CreateTable
CREATE TABLE "public"."OPCLog" (
    "id" TEXT NOT NULL,
    "handle" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "quality" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OPCLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OPCLog_handle_idx" ON "public"."OPCLog"("handle");

-- CreateIndex
CREATE INDEX "OPCLog_timestamp_idx" ON "public"."OPCLog"("timestamp");
