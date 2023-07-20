import { Injectable } from "@nestjs/common";
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from "class-validator";
import { ModalType } from "../constants/model-type";
import { PrismaService } from "../modules/prisma/prisma.service";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueFieldConstraint implements ValidatorConstraintInterface {
  constructor(private readonly model: string) {}
  private prisma = PrismaService.getInstance();
  async validate(valueField: any, args: ValidationArguments) {
    const fieldCheck = args?.property;
    const data = await this.prisma[this.model].findUnique({
      where: {
        [fieldCheck]: valueField
      }
    });
    if (data?.id) {
      return false;
    }
    return true;
  }
}

export function IsUniqueField(model: ModalType, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsUniqueFieldConstraint(model)
    });
  };
}
