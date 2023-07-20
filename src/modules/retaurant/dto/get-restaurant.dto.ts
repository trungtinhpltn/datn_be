import { IsOptional, IsString } from "class-validator";
import { IQuery } from "../../../dto/query";

export class GetRestaurantQuery extends IQuery {
  @IsString()
  @IsOptional()
  active: string;
}
