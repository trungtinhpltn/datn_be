import { Body, Controller, Post, Get, Param, Put, Delete, UseGuards } from "@nestjs/common";
import { MenuCategoryService } from "./menu-category.service";
import { EditTableDto } from "../table-food/dto/edit-table-food.dto";
import { AccessTokenGuard } from "../../guards";
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
  @UseGuards(AccessTokenGuard)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(":id")
  @UseGuards(AccessTokenGuard)
  findById(@Param("id") id: number) {
    return this.categoryService.findById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() createCategoryDto: any) {
    return this.categoryService.create(createCategoryDto);
  }

  @Put(":id")
  @UseGuards(AccessTokenGuard)
  editCategory(@Param("id") id: number, @Body() dto: EditTableDto) {
    return this.categoryService.editCategory(id, dto);
  }
  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  delete(@Param("id") id: number) {
    return this.categoryService.delete(id);
  }
}
