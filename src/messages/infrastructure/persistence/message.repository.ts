import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options.type';
import { Message } from '../../domain/message';

export abstract class MessageRepository {
  abstract create(
    data: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Message>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Message[]>;

  abstract findById(id: Message['id']): Promise<NullableType<Message>>;

  abstract findByIds(ids: Message['id'][]): Promise<Message[]>;

  abstract update(
    id: Message['id'],
    payload: DeepPartial<Message>,
  ): Promise<NullableType<Message>>;

  abstract remove(id: Message['id']): Promise<void>;
}
