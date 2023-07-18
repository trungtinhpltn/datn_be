import { Controller, Get, Post, Body, Query, Param, Put, Delete, UseGuards } from "@nestjs/common";
import { TableFoodService } from "./table-food.service";
import { CreateTableFoodDto } from "./dto/create-table-food.dto";
import { GetTableFoodQuery } from "./dto/get-table-food.dto";
import { EditTableDto } from "./dto/edit-table-food.dto";
import { AccessTokenGuard } from "src/guards";

@Controller({
  path: "/table-food",
  version: "1"
})
export class TableFoodController {
  constructor(private tableFoodService: TableFoodService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  findByQuery(@Query() query: GetTableFoodQuery) {
    return this.tableFoodService.find(query);
  }

  @Get(":id")
  @UseGuards(AccessTokenGuard)
  findById(@Param("id") id: number) {
    return this.tableFoodService.findById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() createTableFoodDto: CreateTableFoodDto) {
    return this.tableFoodService.create(createTableFoodDto);
  }

  @Put(":id")
  @UseGuards(AccessTokenGuard)
  editRestaurant(@Param("id") rid: number, @Body() dto: EditTableDto) {
    return this.tableFoodService.editTableFood(rid, dto);
  }
  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  deleteRestaurant(@Param("id") rid: number) {
    return this.tableFoodService.editTableFood(rid, { isDelete: true });
  }
}
