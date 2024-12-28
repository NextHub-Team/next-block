import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { WhiteListAddress } from '../../domain/white-list-address';

export abstract class WhiteListAddressRepository {
	abstract create(
		data: Omit<WhiteListAddress, 'id' | 'createdAt' | 'updatedAt'>,
	): Promise<WhiteListAddress>;

	abstract findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}): Promise<WhiteListAddress[]>;

	abstract findById(
		id: WhiteListAddress['id'],
	): Promise<NullableType<WhiteListAddress>>;

	abstract findByIds(
		ids: WhiteListAddress['id'][],
	): Promise<WhiteListAddress[]>;

	abstract update(
		id: WhiteListAddress['id'],
		payload: DeepPartial<WhiteListAddress>,
	): Promise<WhiteListAddress | null>;

	abstract remove(id: WhiteListAddress['id']): Promise<void>;
}
