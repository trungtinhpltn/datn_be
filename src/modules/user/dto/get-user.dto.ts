import { IsOptional } from "class-validator";
import { IQuery } from "src/dto/query";

export class GetUserDto extends IQuery {
  @IsOptional()
  teamId?: number;

  @IsOptional()
  role?: string;

  @IsOptional()
  active?: number;

  @IsOptional()
  name?: string;
}
