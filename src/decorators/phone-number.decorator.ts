import { registerDecorator } from "class-validator";
import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";

export function IsVNPhoneNumber(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isVNPhoneNumber",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const phoneNumberCheck = value.match(/(84|0[3|5|7|8|9])+([0-9]{8,13})\b/g);
          if (!phoneNumberCheck) {
            return false;
          } else {
            return true;
          }
        }
      }
    });
  };
}
