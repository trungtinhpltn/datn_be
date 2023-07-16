import { Module } from "@nestjs/common";
import { BillItemModule } from "../bill-item/bill-item.module";
import { BillTableOrderModule } from "../bill-table-order/bill-table-order.module";
import { CustomerModule } from "../customer/customer.module";
import { TableFoodModule } from "../table-food/table-food.module";
import { BillController } from "./bill.controller";
import { BillService } from "./bill.service";

@Module({
  imports: [CustomerModule, BillTableOrderModule, TableFoodModule, BillItemModule],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService]
})
export class BillModule {}
