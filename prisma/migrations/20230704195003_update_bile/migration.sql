-- CreateEnum
CREATE TYPE "BillStatus" AS ENUM ('PENDING', 'ACTIVE');

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "status" "BillStatus" NOT NULL DEFAULT 'PENDING';
