import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  name: string;

  @IsString()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  addressDetail: string;

  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  provinceId: number;

  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  districtId: number;
}
