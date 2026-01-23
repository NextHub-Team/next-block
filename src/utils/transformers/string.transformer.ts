import { TransformFnParams } from 'class-transformer/types/interfaces';
import { MaybeType } from '../types/maybe.type';

export function capitalizeFirst(value: string): string {
  if (!value) return '';
  return value[0].toUpperCase() + value.slice(1);
}

export function lowerCaseTransformer(
  params: TransformFnParams,
): MaybeType<string> {
  return params.value?.toLowerCase().trim();
}

export function defaultStringTransformer(defaultValue: string) {
  return (params: TransformFnParams): string =>
    (params.value === undefined || params.value === null
      ? defaultValue
      : params.value) as string;
}
