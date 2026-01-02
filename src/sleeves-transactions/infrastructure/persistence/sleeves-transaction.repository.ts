import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { SleevesTransaction } from '../../domain/sleeves-transaction';

export abstract class SleevesTransactionRepository {
  abstract create(
    data: Omit<SleevesTransaction, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<SleevesTransaction>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<SleevesTransaction[]>;

  abstract findById(
    id: SleevesTransaction['id'],
  ): Promise<NullableType<SleevesTransaction>>;

  abstract findByIds(
    ids: SleevesTransaction['id'][],
  ): Promise<SleevesTransaction[]>;

  abstract update(
    id: SleevesTransaction['id'],
    payload: DeepPartial<SleevesTransaction>,
  ): Promise<SleevesTransaction | null>;

  abstract remove(id: SleevesTransaction['id']): Promise<void>;
}
