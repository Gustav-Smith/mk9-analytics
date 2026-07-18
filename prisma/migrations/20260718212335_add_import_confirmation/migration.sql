-- CreateTable
CREATE TABLE "ImportConfirmation" (
    "id" TEXT NOT NULL,
    "importId" TEXT NOT NULL,
    "previewArtifactId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "acceptedRows" INTEGER NOT NULL,
    "rejectedRows" INTEGER NOT NULL,
    "confirmedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImportConfirmation_previewArtifactId_key" ON "ImportConfirmation"("previewArtifactId");

-- CreateIndex
CREATE UNIQUE INDEX "ImportConfirmation_idempotencyKey_key" ON "ImportConfirmation"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ImportConfirmation_importId_idx" ON "ImportConfirmation"("importId");

-- AddForeignKey
ALTER TABLE "ImportConfirmation" ADD CONSTRAINT "ImportConfirmation_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Import"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportConfirmation" ADD CONSTRAINT "ImportConfirmation_previewArtifactId_fkey" FOREIGN KEY ("previewArtifactId") REFERENCES "ImportPreviewArtifact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
