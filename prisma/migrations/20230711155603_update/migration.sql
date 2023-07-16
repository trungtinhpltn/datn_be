-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('ATM', 'CASH');

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "paymentMethod" "PaymentMethod";
