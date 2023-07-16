import { Body, Controller, Get, Param, Post, Delete, Query, Put } from "@nestjs/common";
import { CreateOrderDto, GetOrderQuery, GetTableOrderQuery } from "./dto/order.dto";
import { OrderService } from "./order.service";

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
  findAll(@Query() query: GetOrderQuery) {
    return this.orderService.findAll(query);
  }

  @Get("/getById/:id")
  getById(@Param("id") id: number) {
    return this.orderService.getById(id);
  }

  @Get("/getTableOrder/:id")
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
  cancelOrder(@Param("id") id: number, @Query() query: any) {
    return this.orderService.cancelOrder(id, query);
  }

  @Put(":id")
  update(@Param("id") id: number, @Query() query: any, @Body() data: CreateOrderDto) {
    return this.orderService.update(id, query, data);
  }
  @Put("/updateSelectTable/:id")
  updateSelectTable(@Param("id") id: number, @Body() data: CreateOrderDto) {
    return this.orderService.updateSelectTable(id, data);
  }
}
