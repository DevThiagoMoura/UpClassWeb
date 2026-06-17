import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from 'class-validator';
import { isValidCpf } from '../usuario.utils';

export function IsCpf(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object: object, propertyName: string | symbol) => {
    registerDecorator({
      name: 'IsCpf',
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: {
        validate(value: unknown, _args: ValidationArguments): boolean {
          if (value === undefined || value === null || value === '') {
            return true;
          }

          return typeof value === 'string' && isValidCpf(value);
        },
      },
    });
  };
}
