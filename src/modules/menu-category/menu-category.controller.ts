import { Body, Controller, Post, Get, Param, Put, Delete } from "@nestjs/common";
import { MenuCategoryService } from "./menu-category.service";
import { EditTableDto } from "../table-food/dto/edit-table-food.dto";
@Controller({
  path: "/menu-category",
  version: "1"
})
export class MenuCategoryController {
  constructor(private categoryService: MenuCategoryService) {}

  @Get()
  findByQuery() {
    return this.categoryService.findByQuery();
  }

  @Get("/all")
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(":id")
  findById(@Param("id") id: number) {
    return this.categoryService.findById(id);
  }

  @Post()
  create(@Body() createCategoryDto: any) {
    return this.categoryService.create(createCategoryDto);
  }

  @Put(":id")
  editCategory(@Param("id") id: number, @Body() dto: EditTableDto) {
    return this.categoryService.editCategory(id, dto);
  }
  @Delete(":id")
  delete(@Param("id") id: number) {
    return this.categoryService.delete(id);
  }
}
