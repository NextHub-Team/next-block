import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { SupportedAsset } from '../../domain/supported-asset';

export abstract class SupportedAssetRepository {
	abstract create(
		data: Omit<SupportedAsset, 'id' | 'createdAt' | 'updatedAt'>,
	): Promise<SupportedAsset>;

	abstract findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}): Promise<SupportedAsset[]>;

	abstract findById(
		id: SupportedAsset['id'],
	): Promise<NullableType<SupportedAsset>>;

	abstract findByIds(ids: SupportedAsset['id'][]): Promise<SupportedAsset[]>;

	abstract update(
		id: SupportedAsset['id'],
		payload: DeepPartial<SupportedAsset>,
	): Promise<SupportedAsset | null>;

	abstract remove(id: SupportedAsset['id']): Promise<void>;
}
