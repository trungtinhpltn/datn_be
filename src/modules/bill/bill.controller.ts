import { Controller, Post, Body, Get, Delete, Param, Query, Put } from "@nestjs/common";
import { BillService } from "./bill.service";
import { GetBillQuery, UpdateBill } from "./dto/bill.dto";

@Controller({
  path: "/bill",
  version: "1"
})
export class BillController {
  constructor(private billService: BillService) {}

  @Get()
  getAll() {
    return this.billService.findAll();
  }

  @Get("getByQuery")
  getByQuery(@Query() query: GetBillQuery) {
    return this.billService.findByQuery(query);
  }

  @Get("/getById/:id")
  getById(@Param("id") id: number) {
    return this.billService.getById(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.billService.create(data);
  }

  @Delete(":id")
  delete(@Param("id") id: number) {
    return this.billService.delete(id);
  }

  @Put(":id")
  update(@Param("id") id: number, @Body() data: UpdateBill) {
    return this.billService.update(id, data);
  }
}
