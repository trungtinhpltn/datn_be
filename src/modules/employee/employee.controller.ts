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
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IQuery } from "src/dto/query";
import { AccessTokenGuard } from "src/guards";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { EmployeeService } from "./employee.service";

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
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  @UseGuards(AccessTokenGuard)
  async create(@Body() createEmployeeDto: any, @UploadedFile() image: Express.Multer.File) {
    if (image) {
      const res = await this.cloudinaryService.uploadFile(image);
      createEmployeeDto.image = res?.secure_url || "";
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
  @UseInterceptors(FileInterceptor("image"))
  async update(@Param("id") id: string, @Body() updateEmployeeDto: any, @UploadedFile() image: Express.Multer.File) {
    if (image) {
      const res = await this.cloudinaryService.uploadFile(image);
      updateEmployeeDto.image = res?.secure_url || "";
    }
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(":id")
  @UseGuards(AccessTokenGuard)
  remove(@Param("id") id: string) {
    return this.employeeService.remove(+id);
  }
}
