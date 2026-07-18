/*
  Warnings:

  - The values [CLOSED] on the enum `OperationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OperationStatus_new" AS ENUM ('PLANNING', 'OPEN', 'IN_PROGRESS', 'FINISHED', 'CANCELLED', 'ARCHIVED');
ALTER TABLE "public"."Operation" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Operation" ALTER COLUMN "status" TYPE "OperationStatus_new" USING ("status"::text::"OperationStatus_new");
ALTER TYPE "OperationStatus" RENAME TO "OperationStatus_old";
ALTER TYPE "OperationStatus_new" RENAME TO "OperationStatus";
DROP TYPE "public"."OperationStatus_old";
ALTER TABLE "Operation" ALTER COLUMN "status" SET DEFAULT 'PLANNING';
COMMIT;

-- AlterTable
ALTER TABLE "Operation" ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "observations" TEXT,
ALTER COLUMN "status" SET DEFAULT 'PLANNING';
