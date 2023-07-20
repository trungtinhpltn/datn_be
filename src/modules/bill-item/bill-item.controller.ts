import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { BillItemService } from "./bill-item.service";
import { CreateBillItemDto } from "./dto/bill-item.dto";
import { AccessTokenGuard } from "../../guards";

@Controller({
  path: "/bill-item",
  version: "1"
})
export class BillItemController {
  constructor(private billItemService: BillItemService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  getAll() {
    return this.billItemService.findAll();
  }

  @Get("/getById/:id")
  @UseGuards(AccessTokenGuard)
  getById(@Param("id") id: number) {
    return this.billItemService.getById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() data: CreateBillItemDto) {
    return this.billItemService.create(data);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  delete(@Param("id") id: number) {
    return this.billItemService.delete(id);
  }
  @Put(":id")
  @UseGuards(AccessTokenGuard)
  update(@Param("id") id: number, @Body() data: CreateBillItemDto) {
    return this.billItemService.update(id, data);
  }
}
