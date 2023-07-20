import { Controller, Post, Body, Get, Query, UseGuards, Put, Param } from "@nestjs/common";
import { ShiftService } from "./shift.service";
import { CreateShiftDto, GetByUserIdQuery, GetHisShiftByRestaurant } from "./dto/shift.dto";
import { AccessTokenGuard } from "../../guards";
@Controller({
  path: "/shift",
  version: "1"
})
export class ShiftController {
  constructor(private shiftService: ShiftService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  findByUserId(@Query() query: GetByUserIdQuery) {
    return this.shiftService.findByUserId(query);
  }

  @Get("/getHisShiftByRestaurant")
  @UseGuards(AccessTokenGuard)
  getHisShiftByRestaurant(@Query() query: GetHisShiftByRestaurant) {
    return this.shiftService.getHisShiftByRestaurant(query);
  }

  @Get("/getHisShiftByEmployee")
  @UseGuards(AccessTokenGuard)
  getHisShiftByEmployee(@Query() query: GetHisShiftByRestaurant) {
    return this.shiftService.getHisShiftByEmployee(query);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() data: CreateShiftDto) {
    return this.shiftService.create(data);
  }
  @Post("/createHisShift")
  @UseGuards(AccessTokenGuard)
  createHisShift(@Body() data: any) {
    return this.shiftService.createHisShiftByEmp(data);
  }

  @Put("/updateHisShift/:id")
  @UseGuards(AccessTokenGuard)
  update(@Param("id") id: number, @Body() data: any) {
    return this.shiftService.updateHisShift(id, data);
  }
}
