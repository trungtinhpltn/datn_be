import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "src/guards";
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
  @UseGuards(AccessTokenGuard)
  delete(@Param("id") id: number) {
    return this.billTableOrderService.delete(id);
  }
}
