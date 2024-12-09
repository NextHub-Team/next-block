import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { EventLog } from '../../domain/event-log';

export abstract class EventLogRepository {
  abstract create(
    data: Omit<EventLog, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<EventLog>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<EventLog[]>;

  abstract findById(id: EventLog['id']): Promise<NullableType<EventLog>>;

  abstract findByIds(ids: EventLog['id'][]): Promise<EventLog[]>;

  abstract update(
    id: EventLog['id'],
    payload: DeepPartial<EventLog>,
  ): Promise<EventLog | null>;

  abstract remove(id: EventLog['id']): Promise<void>;
}
