import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Sleeves } from '../../domain/sleeves';

export abstract class SleevesRepository {
  abstract create(
    data: Omit<Sleeves, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Sleeves>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Sleeves[]>;

  abstract findById(id: Sleeves['id']): Promise<NullableType<Sleeves>>;

  abstract findByIds(ids: Sleeves['id'][]): Promise<Sleeves[]>;

  abstract update(
    id: Sleeves['id'],
    payload: DeepPartial<Sleeves>,
  ): Promise<Sleeves | null>;

  abstract remove(id: Sleeves['id']): Promise<void>;
}
