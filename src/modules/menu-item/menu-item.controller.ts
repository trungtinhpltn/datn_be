import { Body, Controller, Get, Post, Query, Param, Put, Delete, UseGuards } from "@nestjs/common";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { GetMenuItemQuery } from "./dto/get-menu-item.dto";
import { MenuItemService } from "./menu-item.service";
import { AccessTokenGuard } from "../../guards";
@Controller({
  path: "/menu-item",
  version: "1"
})
export class MenuItemController {
  constructor(private menuitemService: MenuItemService) {}
  // @Get()
  // findAll() {
  //   return this.menuitemService.findAll();
  // }

  @Get()
  @UseGuards(AccessTokenGuard)
  findByQuery(@Query() query: GetMenuItemQuery) {
    return this.menuitemService.findByQuery(query);
  }

  @Get("/findAllByRestaurant/:id")
  @UseGuards(AccessTokenGuard)
  findAllByRestaurant(@Param("id") id: number) {
    return this.menuitemService.findAllByRestaurant(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() data: CreateMenuItemDto) {
    return this.menuitemService.create(data);
  }

  @Get(":id")
  @UseGuards(AccessTokenGuard)
  findById(@Param("id") id: number, @Query() query: GetMenuItemQuery) {
    return this.menuitemService.findById(id, query);
  }

  @Put(":id")
  @UseGuards(AccessTokenGuard)
  updateMenuItem(@Param("id") id: number, @Body() data: CreateMenuItemDto) {
    return this.menuitemService.update(id, data);
  }
  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  delete(@Param("id") id: number) {
    return this.menuitemService.delete(id);
  }
}
