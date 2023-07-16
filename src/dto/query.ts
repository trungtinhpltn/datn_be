import { IsNumber, IsOptional, IsString } from "class-validator";

export const DEFAULT_SIZE = 10;
export class IQuery {
  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  size: number;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  constructor() {
    this.sort = "id:desc";
    this.size = DEFAULT_SIZE;
    this.page = 1;
  }
}
