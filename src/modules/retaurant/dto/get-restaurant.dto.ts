import { IsOptional, IsString } from "class-validator";
import { IQuery } from "src/dto/query";

export class GetRestaurantQuery extends IQuery {
  @IsString()
  @IsOptional()
  active: string;
}
