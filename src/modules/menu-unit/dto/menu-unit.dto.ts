import { IsOptional, IsString } from "class-validator";
import { IQuery } from "../../../dto/query";

export class EditMenuUnit extends IQuery {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
