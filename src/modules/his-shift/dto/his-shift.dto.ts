import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateHisShift {
  @IsNumber()
  @IsNotEmpty({
    message: "Đầu vào không hợp lệ"
  })
  employeeId: number;

  @IsString()
  @IsNotEmpty({
    message: "Đầu vào không hợp lệ"
  })
  startDate: string;

  @IsString()
  @IsNotEmpty({
    message: "Đầu vào không hợp lệ"
  })
  endDate: string;

  @IsNumber()
  @IsNotEmpty({
    message: "Đầu vào không hợp lệ"
  })
  year: number;

  @IsArray()
  @IsOptional()
  monday: number[];
  @IsArray()
  @IsOptional()
  tuesday: number[];
  @IsArray()
  @IsOptional()
  wednesday: number[];
  @IsArray()
  @IsOptional()
  thursday: number[];
  @IsArray()
  @IsOptional()
  friday: number[];
  @IsArray()
  @IsOptional()
  saturday: number[];
  @IsArray()
  @IsOptional()
  sunday: number[];

  @IsNumber()
  @IsOptional()
  restaurantId: number;
}

export class UpdateHisShift {
  @IsArray()
  @IsOptional()
  monday: number[];
  @IsArray()
  @IsOptional()
  tuesday: number[];
  @IsArray()
  @IsOptional()
  wednesday: number[];
  @IsArray()
  @IsOptional()
  thursday: number[];
  @IsArray()
  @IsOptional()
  friday: number[];
  @IsArray()
  @IsOptional()
  saturday: number[];
  @IsArray()
  @IsOptional()
  sunday: number[];

  @IsDate()
  @IsOptional()
  updatedAt: Date;

  @IsString()
  @IsOptional()
  msg: string;
}
