import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Type } from '../../domain/type';

export abstract class TypeRepository {
  abstract create(
    data: Omit<Type, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Type>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Type[]>;

  abstract findById(id: Type['id']): Promise<NullableType<Type>>;

  abstract findByIds(ids: Type['id'][]): Promise<Type[]>;

  abstract update(
    id: Type['id'],
    payload: DeepPartial<Type>,
  ): Promise<Type | null>;

  abstract remove(id: Type['id']): Promise<void>;
}
