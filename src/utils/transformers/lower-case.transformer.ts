import { TransformFnParams } from 'class-transformer/types/interfaces';
import { MaybeType } from '../types/maybe.type';

export function lowerCaseTransformer(
  params: TransformFnParams,
): MaybeType<string> {
  return params.value?.toLowerCase().trim();
}
