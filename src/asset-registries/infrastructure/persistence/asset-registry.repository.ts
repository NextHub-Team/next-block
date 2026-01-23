import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options.type';
import { AssetRegistry } from '../../domain/asset-registry';

export abstract class AssetRegistryRepository {
  abstract create(
    data: Omit<AssetRegistry, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AssetRegistry>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AssetRegistry[]>;

  abstract findById(
    id: AssetRegistry['id'],
  ): Promise<NullableType<AssetRegistry>>;

  abstract findByIds(ids: AssetRegistry['id'][]): Promise<AssetRegistry[]>;

  abstract update(
    id: AssetRegistry['id'],
    payload: DeepPartial<AssetRegistry>,
  ): Promise<AssetRegistry | null>;

  abstract findByProviderName(
    providerName: AssetRegistry['providerName'],
  ): Promise<AssetRegistry[]>;

  abstract remove(id: AssetRegistry['id']): Promise<void>;

  abstract findByAssetId(
    assetId: AssetRegistry['assetId'],
  ): Promise<NullableType<AssetRegistry>>;
}
