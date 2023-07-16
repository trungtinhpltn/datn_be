import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { BillItemService } from "./bill-item.service";
import { CreateBillItemDto } from "./dto/bill-item.dto";

@Controller({
  path: "/bill-item",
  version: "1"
})
export class BillItemController {
  constructor(private billItemService: BillItemService) {}

  @Get()
  getAll() {
    return this.billItemService.findAll();
  }

  @Get("/getById/:id")
  getById(@Param("id") id: number) {
    return this.billItemService.getById(id);
  }

  @Post()
  create(@Body() data: CreateBillItemDto) {
    return this.billItemService.create(data);
  }

  @Delete(":id")
  delete(@Param("id") id: number) {
    return this.billItemService.delete(id);
  }
  @Put(":id")
  update(@Param("id") id: number, @Body() data: CreateBillItemDto) {
    return this.billItemService.update(id, data);
  }
}
