import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

function generateErrors(errors: ValidationError[]) {
  return errors.reduce(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.property]:
        (currentValue.children?.length ?? 0) > 0
          ? generateErrors(currentValue.children ?? [])
          : Object.values(currentValue.constraints ?? {}).join(', '),
    }),
    {},
  );
}

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    return new UnprocessableEntityException({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: generateErrors(errors),
    });
  },
};

/**
 * Validates a given value against a target value and returns the default value if they do not match.
 *
 * @template T - The type of the value to validate.
 * @param value - The value to validate.
 * @param target - The target value to compare against.
 * @param defaultValue - The default value to return if `value` does not match `target`.
 * @returns The `value` if it matches the `target`; otherwise, the `defaultValue`.
 *
 * @example
 * ```typescript
 * const result = validateValue(10, 10, 0); // result: 10
 * const result2 = validateValue(5, 10, 0); // result: 0
 * ```
 */
export const validateValue = <T>(value: T, target: T, defaultValue: T): T => {
  return value === target ? value : defaultValue;
};

export default validationOptions;
