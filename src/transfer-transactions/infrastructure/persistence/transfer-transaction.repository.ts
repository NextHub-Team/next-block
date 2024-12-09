import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { TransferTransaction } from '../../domain/transfer-transaction';

export abstract class TransferTransactionRepository {
  abstract create(
    data: Omit<TransferTransaction, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<TransferTransaction>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<TransferTransaction[]>;

  abstract findById(
    id: TransferTransaction['id'],
  ): Promise<NullableType<TransferTransaction>>;

  abstract findByIds(
    ids: TransferTransaction['id'][],
  ): Promise<TransferTransaction[]>;

  abstract update(
    id: TransferTransaction['id'],
    payload: DeepPartial<TransferTransaction>,
  ): Promise<TransferTransaction | null>;

  abstract remove(id: TransferTransaction['id']): Promise<void>;
}
