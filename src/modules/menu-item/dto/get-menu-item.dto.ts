import { IsNumber, IsOptional } from "class-validator";
import { IQuery } from "../../../dto/query";

export class GetMenuItemQuery extends IQuery {
  @IsNumber()
  @IsOptional()
  restaurant_id: number;
}
