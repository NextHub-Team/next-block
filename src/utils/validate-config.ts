import { plainToClass } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';

function validateConfig<T extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
) {
  // const errors = validateSync(validatedConfig, {
  //   skipMissingProperties: false,
  // });
  // TODO fix return as logger error with details
  // if (errors.length > 0) {
  //   throw new Error(errors.toString());
  // }
  return plainToClass(envVariablesClass, config, {
    enableImplicitConversion: true,
  });
}

export default validateConfig;
