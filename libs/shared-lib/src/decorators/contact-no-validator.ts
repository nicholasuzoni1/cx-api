import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import phone from 'phone';

export function IsValidContactNo(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidContactNo',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          const check = phone(value);
          return check.isValid;
        },
        defaultMessage(_args: ValidationArguments) {
          return 'Contact No is invalid';
        },
      },
    });
  };
}
