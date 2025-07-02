import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../config/config.type';

export function IsAllowedExchange(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    const configService = new ConfigService<AllConfigType>();
    const exchanges =
      configService.get('rabbitMQ.exchanges', { infer: true }) || [];
    registerDecorator({
      name: 'IsAllowedExchange',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(exchange: string, args: ValidationArguments) {
          return exchanges.includes(exchange);
        },
      },
    });
  };
}
