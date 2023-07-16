import { IsNumber, IsOptional } from "class-validator";
import { IQuery } from "src/dto/query";

export class GetMenuItemQuery extends IQuery {
  @IsNumber()
  @IsOptional()
  restaurant_id: number;
}
