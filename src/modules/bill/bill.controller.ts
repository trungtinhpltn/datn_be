import { Controller, Post, Body, Get, Delete, Param, Query, Put, UseGuards } from "@nestjs/common";
import { BillService } from "./bill.service";
import { GetBillQuery, GetReportQuery, UpdateBill } from "./dto/bill.dto";
import { AccessTokenGuard } from "src/guards";

@Controller({
  path: "/bill",
  version: "1"
})
export class BillController {
  constructor(private billService: BillService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  getAll() {
    return this.billService.findAll();
  }

  @Get("/getByQuery")
  @UseGuards(AccessTokenGuard)
  getByQuery(@Query() query: GetBillQuery) {
    return this.billService.findByQuery(query);
  }

  @Get("/getReport")
  @UseGuards(AccessTokenGuard)
  getReport(@Query() query: GetReportQuery) {
    return this.billService.getReport(query);
  }

  @Get("/getById/:id")
  @UseGuards(AccessTokenGuard)
  getById(@Param("id") id: number) {
    return this.billService.getById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() data: any) {
    return this.billService.create(data);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  delete(@Param("id") id: number) {
    return this.billService.delete(id);
  }

  @Put(":id")
  @UseGuards(AccessTokenGuard)
  update(@Param("id") id: number, @Body() data: UpdateBill) {
    return this.billService.update(id, data);
  }
}
