import { Module } from "@nestjs/common";
import { BillItemService } from "./bill-item.service";
import { BillItemController } from "./bill-item.controller";

@Module({
  controllers: [BillItemController],
  providers: [BillItemService],
  exports: [BillItemService]
})
export class BillItemModule {}
