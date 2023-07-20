import { IsEnum, IsNotEmpty } from "class-validator";
import { CardOrientation } from "../../../constants/card-type";

export class EkycDto {
  @IsNotEmpty({ message: "type is required" })
  @IsEnum(CardOrientation)
  type: CardOrientation;
}
