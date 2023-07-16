-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "restaurantId" INTEGER;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_restaurant_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
