-- AlterTable
ALTER TABLE "MenuCategory" ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MenuUnit" ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;
