import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from "@nestjs/common";
import { EditTableDto } from "../table-food/dto/edit-table-food.dto";
import { MenuUnitService } from "./menu-unit.service";
import { AccessTokenGuard } from "src/guards";
@Controller({
  path: "/menu-unit",
  version: "1"
})
export class MenuUnitController {
  constructor(private unitService: MenuUnitService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  findByQuery() {
    return this.unitService.findByQuery();
  }

  @Get("/all")
  @UseGuards(AccessTokenGuard)
  findAll() {
    return this.unitService.findAll();
  }

  @Get(":id")
  @UseGuards(AccessTokenGuard)
  findById(@Param("id") id: number) {
    return this.unitService.findById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() createCategoryDto: any) {
    return this.unitService.create(createCategoryDto);
  }

  @Put(":id")
  @UseGuards(AccessTokenGuard)
  editCategory(@Param("id") id: number, @Body() dto: EditTableDto) {
    return this.unitService.editCategory(id, dto);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  delete(@Param("id") id: number) {
    return this.unitService.delete(id);
  }
}
