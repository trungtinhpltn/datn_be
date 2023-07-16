import { Body, Controller, Get, Delete, Param } from "@nestjs/common";
import { BillTableOrderService } from "./bill-table-order.service";

@Controller({
  path: "/bill-table-order",
  version: "1"
})
export class BillTableOrderController {
  constructor(private billTableOrderService: BillTableOrderService) {}

  @Get()
  getAll() {
    return this.billTableOrderService.findAll();
  }

  @Delete(":id")
  delete(@Param("id") id: number) {
    return this.billTableOrderService.delete(id);
  }
}
