import { TableFoodStatus } from "@prisma/client";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class EditTableDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  prePaymentAmount?: number;

  @IsEnum(TableFoodStatus)
  @IsOptional()
  status?: TableFoodStatus;

  @IsBoolean()
  @IsOptional()
  isDelete?: boolean;
}
