import { Module } from "@nestjs/common";
import { BillTableOrderService } from "./bill-table-order.service";
import { BillTableOrderController } from "./bill-table-order.controller";

@Module({
  controllers: [BillTableOrderController],
  providers: [BillTableOrderService],
  exports: [BillTableOrderService]
})
export class BillTableOrderModule {}
