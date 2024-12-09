import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { NFT } from '../../domain/nft';

export abstract class NFTRepository {
  abstract create(
    data: Omit<NFT, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<NFT>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<NFT[]>;

  abstract findById(id: NFT['id']): Promise<NullableType<NFT>>;

  abstract findByIds(ids: NFT['id'][]): Promise<NFT[]>;

  abstract update(
    id: NFT['id'],
    payload: DeepPartial<NFT>,
  ): Promise<NFT | null>;

  abstract remove(id: NFT['id']): Promise<void>;
}
