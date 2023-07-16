import { Module } from "@nestjs/common";
import { MenuCategoryController } from "./menu-category.controller";
import { MenuCategoryService } from "./menu-category.service";

@Module({
  controllers: [MenuCategoryController],
  providers: [MenuCategoryService]
})
export class MenuCategoryModule {}
