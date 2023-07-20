import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { TableFoodStatus } from "src/constants/tablefood";
import { IQuery } from "../../../dto/query";

export class GetTableFoodQuery extends IQuery {
  @IsEnum(TableFoodStatus, {
    message: "Dữ liệu đầu vào không hợp lệ"
  })
  @IsOptional()
  status: TableFoodStatus;

  @IsNumber()
  @IsOptional()
  restaurant_id: number;
}
