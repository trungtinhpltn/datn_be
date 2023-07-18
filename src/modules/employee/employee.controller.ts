import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { uploadStorage } from "src/common/utils";
import { IQuery } from "src/dto/query";
import { imageFileFilter } from "src/helper/imageFileFilter";
import { EmployeeService } from "./employee.service";
import { AccessTokenGuard } from "src/guards";

export class QueryEmployeeParams extends IQuery {
  @IsOptional()
  @IsString()
  position?: string;
  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  restaurant_id: number;
  @IsOptional()
  @IsNumber()
  active?: number;
}

@Controller({
  path: "/employee",
  version: "1"
})
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("image", {
      storage: uploadStorage("./public/uploads/employee"),
      fileFilter: imageFileFilter
    })
  )
  @UseGuards(AccessTokenGuard)
  create(@Body() createEmployeeDto: any, @UploadedFile() image: Express.Multer.File) {
    if (image) {
      createEmployeeDto.image = "/uploads/employee/" + image.filename;
    }
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  findAll(@Query() { page, size, sort, q, position, restaurant_id }: QueryEmployeeParams) {
    return this.employeeService.findAll({ page, size, sort, q, position, restaurant_id });
  }

  @Get(":id")
  @UseGuards(AccessTokenGuard)
  findOne(@Param("id") id: string) {
    return this.employeeService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(
    FileInterceptor("image", {
      storage: uploadStorage("./public/uploads/employee"),
      fileFilter: imageFileFilter
    })
  )
  update(@Param("id") id: string, @Body() updateEmployeeDto: any, @UploadedFile() image: Express.Multer.File) {
    if (image) {
      updateEmployeeDto.image = "/uploads/employee/" + image.filename;
    }
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  remove(@Param("id") id: string) {
    return this.employeeService.remove(+id);
  }
}
