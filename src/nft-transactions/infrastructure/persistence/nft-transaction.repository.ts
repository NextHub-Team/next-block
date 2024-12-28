import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { NftTransaction } from '../../domain/nft-transaction';

export abstract class NftTransactionRepository {
	abstract create(
		data: Omit<NftTransaction, 'id' | 'createdAt' | 'updatedAt'>,
	): Promise<NftTransaction>;

	abstract findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}): Promise<NftTransaction[]>;

	abstract findById(
		id: NftTransaction['id'],
	): Promise<NullableType<NftTransaction>>;

	abstract findByIds(ids: NftTransaction['id'][]): Promise<NftTransaction[]>;

	abstract update(
		id: NftTransaction['id'],
		payload: DeepPartial<NftTransaction>,
	): Promise<NftTransaction | null>;

	abstract remove(id: NftTransaction['id']): Promise<void>;
}
