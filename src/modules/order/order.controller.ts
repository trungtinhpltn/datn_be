import { Body, Controller, Get, Param, Post, Delete, Query, Put, UseGuards } from "@nestjs/common";
import { CreateOrderDto, GetOrderQuery, GetTableOrderQuery } from "./dto/order.dto";
import { OrderService } from "./order.service";
import { AccessTokenGuard } from "src/guards";

@Controller({
  path: "/order",
  version: "1"
})
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Get()
  find() {
    return this.orderService.find();
  }

  @Get("/getOrder")
  @UseGuards(AccessTokenGuard)
  findAll(@Query() query: GetOrderQuery) {
    return this.orderService.findAll(query);
  }

  @Get("/getById/:id")
  @UseGuards(AccessTokenGuard)
  getById(@Param("id") id: number) {
    return this.orderService.getById(id);
  }

  @Get("/getTableOrder/:id")
  @UseGuards(AccessTokenGuard)
  getTableOrder(@Param("id") id: number, @Query() query: GetTableOrderQuery) {
    return this.orderService.getTableOrder(id, query);
  }

  @Get("/getByKey/:key")
  getByKey(@Param("key") key: string) {
    return this.orderService.findByKey(key);
  }
  @Post()
  create(@Body() data: CreateOrderDto) {
    return this.orderService.create(data);
  }

  @Delete("/cancelOrder/:id")
  @UseGuards(AccessTokenGuard)
  cancelOrder(@Param("id") id: number, @Query() query: any) {
    return this.orderService.cancelOrder(id, query);
  }

  @Put(":id")
  @UseGuards(AccessTokenGuard)
  update(@Param("id") id: number, @Query() query: any, @Body() data: CreateOrderDto) {
    return this.orderService.update(id, query, data);
  }

  @Put("/updateSelectTable/:id")
  @UseGuards(AccessTokenGuard)
  updateSelectTable(@Param("id") id: number, @Body() data: CreateOrderDto) {
    return this.orderService.updateSelectTable(id, data);
  }
}
