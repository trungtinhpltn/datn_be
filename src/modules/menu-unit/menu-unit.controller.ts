import { Body, Controller, Get, Param, Post, Put, Delete } from "@nestjs/common";
import { EditTableDto } from "../table-food/dto/edit-table-food.dto";
import { MenuUnitService } from "./menu-unit.service";
@Controller({
  path: "/menu-unit",
  version: "1"
})
export class MenuUnitController {
  constructor(private unitService: MenuUnitService) {}

  @Get()
  findByQuery() {
    return this.unitService.findByQuery();
  }

  @Get("/all")
  findAll() {
    return this.unitService.findAll();
  }

  @Get(":id")
  findById(@Param("id") id: number) {
    return this.unitService.findById(id);
  }

  @Post()
  create(@Body() createCategoryDto: any) {
    return this.unitService.create(createCategoryDto);
  }

  @Put(":id")
  editCategory(@Param("id") id: number, @Body() dto: EditTableDto) {
    return this.unitService.editCategory(id, dto);
  }

  @Delete(":id")
  delete(@Param("id") id: number) {
    return this.unitService.delete(id);
  }
}
