import { Controller, Get, Param, Query } from "@nestjs/common";
import { ProvinceType } from "@prisma/client";
import { ProvinceService } from "./province.service";

@Controller({
  path: "/province",
  version: "1"
})
export class ProvinceController {
  constructor(private provinceService: ProvinceService) {}
  @Get()
  findAll() {
    return this.provinceService.findAll();
  }

  @Get("/findByType")
  findByType(@Query("type") type: ProvinceType) {
    return this.provinceService.findAllByType(type);
  }
  @Get(":id")
  findByParentId(@Param("id") id: number) {
    return this.provinceService.findAllByParentId(id);
  }
}
