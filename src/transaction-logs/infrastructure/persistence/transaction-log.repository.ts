import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { TransactionLog } from '../../domain/transaction-log';

export abstract class TransactionLogRepository {
  abstract create(
    data: Omit<TransactionLog, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<TransactionLog>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<TransactionLog[]>;

  abstract findById(
    id: TransactionLog['id'],
  ): Promise<NullableType<TransactionLog>>;

  abstract findByIds(ids: TransactionLog['id'][]): Promise<TransactionLog[]>;

  abstract update(
    id: TransactionLog['id'],
    payload: DeepPartial<TransactionLog>,
  ): Promise<TransactionLog | null>;

  abstract remove(id: TransactionLog['id']): Promise<void>;
}
