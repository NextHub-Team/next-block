import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { UserLog } from '../../domain/user-log';

export abstract class UserLogRepository {
	abstract create(
		data: Omit<UserLog, 'id' | 'createdAt' | 'updatedAt'>,
	): Promise<UserLog>;

	abstract findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}): Promise<UserLog[]>;

	abstract findById(id: UserLog['id']): Promise<NullableType<UserLog>>;

	abstract findByIds(ids: UserLog['id'][]): Promise<UserLog[]>;

	abstract update(
		id: UserLog['id'],
		payload: DeepPartial<UserLog>,
	): Promise<UserLog | null>;

	abstract remove(id: UserLog['id']): Promise<void>;
}
