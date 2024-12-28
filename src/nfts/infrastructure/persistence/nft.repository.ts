import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Nft } from '../../domain/nft';

export abstract class NftRepository {
	abstract create(
		data: Omit<Nft, 'id' | 'createdAt' | 'updatedAt'>,
	): Promise<Nft>;

	abstract findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}): Promise<Nft[]>;

	abstract findById(id: Nft['id']): Promise<NullableType<Nft>>;

	abstract findByIds(ids: Nft['id'][]): Promise<Nft[]>;

	abstract update(
		id: Nft['id'],
		payload: DeepPartial<Nft>,
	): Promise<Nft | null>;

	abstract remove(id: Nft['id']): Promise<void>;
}
