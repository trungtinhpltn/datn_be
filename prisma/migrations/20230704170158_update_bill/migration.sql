/*
  Warnings:

  - You are about to drop the column `menuItemId` on the `BillItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BillItem" DROP CONSTRAINT "BillItem_menuitem_fkey";

-- AlterTable
ALTER TABLE "BillItem" DROP COLUMN "menuItemId";

-- AddForeignKey
ALTER TABLE "BillItem" ADD CONSTRAINT "BillItem_menuitem_fkey" FOREIGN KEY ("itemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
