import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class EditRestaurantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  addressDetail?: string;

  @IsNumber()
  @IsOptional()
  provinceId?: number;

  @IsNumber()
  @IsOptional()
  districtId?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  isDelete?: boolean;
}
