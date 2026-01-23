import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options.type';
import { InternalEvent } from '../../domain/internal-event';

export abstract class InternalEventRepository {
  abstract create(
    data: Omit<InternalEvent, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<InternalEvent>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<InternalEvent[]>;

  abstract findById(
    id: InternalEvent['id'],
  ): Promise<NullableType<InternalEvent>>;

  abstract findByIds(ids: InternalEvent['id'][]): Promise<InternalEvent[]>;

  abstract update(
    id: InternalEvent['id'],
    payload: DeepPartial<InternalEvent>,
  ): Promise<InternalEvent | null>;

  abstract remove(id: InternalEvent['id']): Promise<void>;
}
