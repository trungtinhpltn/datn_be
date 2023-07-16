import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateShiftDto {
  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  employeeId: number;
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
}

export class GetByUserIdQuery {
  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  user_id: number;
}

export class GetHisShiftByRestaurant {
  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  year: number;

  @IsString()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  start: string;

  @IsString()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  end: string;

  @IsNumber()
  @IsOptional()
  restaurant_id: number;

  @IsNumber()
  @IsOptional()
  employee_id: number;
}
