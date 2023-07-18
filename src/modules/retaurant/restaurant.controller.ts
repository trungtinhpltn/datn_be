import { EditRestaurantDto } from "./dto/edit-restaurant.dto";
import { Body, Controller, Post, Get, Query, Put, Param, Delete, UseGuards } from "@nestjs/common";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { GetRestaurantQuery } from "./dto/get-restaurant.dto";
import { RestaurantService } from "./restaurant.service";
import { AccessTokenGuard } from "src/guards";
@Controller({
  path: "/restaurant",
  version: "1"
})
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}
  @Get()
  findAllByQuery(@Query() query: GetRestaurantQuery) {
    return this.restaurantService.findByQuery(query);
  }

  @Get("/all")
  findAll() {
    return this.restaurantService.find();
  }

  @Get(":id")
  @UseGuards(AccessTokenGuard)
  getById(@Param("id") id: number) {
    return this.restaurantService.findById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @Put(":id")
  @UseGuards(AccessTokenGuard)
  editRestaurant(@Param("id") rid: number, @Body() dto: EditRestaurantDto) {
    return this.restaurantService.editRestaurant(rid, dto);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  deleteRestaurant(@Param("id") rid: number) {
    return this.restaurantService.editRestaurant(rid, { isDelete: true });
  }
}
