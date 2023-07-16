import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class EditUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsString()
  @IsOptional()
  role?: string;
}
