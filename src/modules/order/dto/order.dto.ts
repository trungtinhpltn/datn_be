import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IQuery } from "src/dto/query";

export class GetOrderQuery extends IQuery {
  @IsString()
  @IsOptional()
  status: string;

  @IsNumber()
  @IsOptional()
  date: number;

  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  restaurant_id: number;

  @IsNumber()
  @IsOptional()
  table_id: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  name: string;

  @IsString()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  phone: string;

  @IsString()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  date: string;

  @IsString()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  time: string;

  @IsEmail()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  email: string;

  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  person: number;

  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  restaurantId: number;

  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  children: number;
  @IsBoolean()
  @IsOptional()
  confirm: boolean;
  @IsNumber()
  @IsOptional()
  tableId: number;
}

export class GetTableOrderQuery extends IQuery {
  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  restaurantId: number;
}
