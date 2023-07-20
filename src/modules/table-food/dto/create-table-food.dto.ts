import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTableFoodDto {
  @IsString()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  name: string;

  @IsString()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  description: string;

  // @IsNumber()
  // @IsNotEmpty({
  //   message: "Dữ liệu đầu vào không hợp lệ"
  // })
  // prePaymentAmount: number;

  @IsNumber()
  @IsOptional()
  prePaymentAmount: number;

  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  restaurantId: number;
}
