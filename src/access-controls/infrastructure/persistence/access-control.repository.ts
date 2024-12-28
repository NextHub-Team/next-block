import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { AccessControl } from '../../domain/access-control';

export abstract class AccessControlRepository {
  abstract create(
    data: Omit<AccessControl, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AccessControl>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AccessControl[]>;

  abstract findById(
    id: AccessControl['id'],
  ): Promise<NullableType<AccessControl>>;

  abstract findByIds(ids: AccessControl['id'][]): Promise<AccessControl[]>;

  abstract update(
    id: AccessControl['id'],
    payload: DeepPartial<AccessControl>,
  ): Promise<AccessControl | null>;

  abstract remove(id: AccessControl['id']): Promise<void>;
}
