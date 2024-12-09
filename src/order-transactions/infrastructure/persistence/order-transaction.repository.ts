import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { OrderTransaction } from '../../domain/order-transaction';

export abstract class OrderTransactionRepository {
  abstract create(
    data: Omit<OrderTransaction, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<OrderTransaction>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<OrderTransaction[]>;

  abstract findById(
    id: OrderTransaction['id'],
  ): Promise<NullableType<OrderTransaction>>;

  abstract findByIds(
    ids: OrderTransaction['id'][],
  ): Promise<OrderTransaction[]>;

  abstract update(
    id: OrderTransaction['id'],
    payload: DeepPartial<OrderTransaction>,
  ): Promise<OrderTransaction | null>;

  abstract remove(id: OrderTransaction['id']): Promise<void>;
}
