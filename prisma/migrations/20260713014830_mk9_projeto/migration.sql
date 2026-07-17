-- CreateTable
CREATE TABLE "Import" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Import_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportFile" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileHash" TEXT NOT NULL,
    "rowCount" INTEGER,
    "importId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImportFile_fileHash_key" ON "ImportFile"("fileHash");

-- AddForeignKey
ALTER TABLE "ImportFile" ADD CONSTRAINT "ImportFile_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Import"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
