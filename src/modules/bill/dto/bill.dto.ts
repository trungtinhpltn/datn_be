import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { BillStatus, PaymentMethod } from "../../../constants/bill";
import { IQuery } from "../../../dto/query";

export interface ICreateBill {
  customer?: {
    name: string;
    phone: string;
  };
  tableId: number;
  restaurantId: number;
}

export class GetBillQuery extends IQuery {
  @IsEnum(BillStatus)
  @IsOptional()
  status: BillStatus;

  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  restaurant_id: number;
}

export class UpdateBill {
  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  paymentPrice: number;
  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  totalPrice: number;
  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  taxPay: number;
  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  customerPay: number;

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

  @IsEnum(PaymentMethod)
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  paymentMethod: PaymentMethod;

  @IsNumber()
  @IsOptional()
  exportDate: number;
}

export class GetReportQuery {
  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  from: number;

  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  to: number;
  @IsNumber()
  @IsNotEmpty({
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  restaurant_id: number;
}
