import { IsNotEmpty, IsString } from "class-validator";
import { IQuery } from "../../../dto/query";

export class ICreateCustomer {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class GetCustomerQuery extends IQuery {
  @IsString()
  @IsNotEmpty({
    message: "Đầu vào dữ liệu không hợp lệ"
  })
  phone: string;
}
