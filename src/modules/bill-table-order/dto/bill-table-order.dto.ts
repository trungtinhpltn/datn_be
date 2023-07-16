import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ICreateBillTableOrder {
  @IsNumber()
  @IsNotEmpty()
  tableId: number;
  @IsNumber()
  @IsNotEmpty()
  billId: number;
}
