-- CreateTable
CREATE TABLE "ImportPreviewArtifact" (
    "id" TEXT NOT NULL,
    "importId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "fileHash" TEXT NOT NULL,
    "dataDigest" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "acceptedRows" INTEGER NOT NULL,
    "rejectedRows" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportPreviewArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImportPreviewArtifact_tokenHash_key" ON "ImportPreviewArtifact"("tokenHash");

-- CreateIndex
CREATE INDEX "ImportPreviewArtifact_importId_idx" ON "ImportPreviewArtifact"("importId");

-- CreateIndex
CREATE INDEX "ImportPreviewArtifact_expiresAt_idx" ON "ImportPreviewArtifact"("expiresAt");

-- AddForeignKey
ALTER TABLE "ImportPreviewArtifact" ADD CONSTRAINT "ImportPreviewArtifact_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Import"("id") ON DELETE CASCADE ON UPDATE CASCADE;
