import { TransformFnParams } from 'class-transformer/types/interfaces';

export function optionalNumberTransformer(
  params: TransformFnParams,
): number | undefined {
  return params.value !== undefined ? Number(params.value) : undefined;
}

export function numberTransformer(params: TransformFnParams): number {
  return Number(params.value);
}
