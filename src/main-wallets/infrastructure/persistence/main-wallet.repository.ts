import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { MainWallet } from '../../domain/main-wallet';

export abstract class MainWalletRepository {
  abstract create(
    data: Omit<MainWallet, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<MainWallet>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<MainWallet[]>;

  abstract findById(id: MainWallet['id']): Promise<NullableType<MainWallet>>;

  abstract findByIds(ids: MainWallet['id'][]): Promise<MainWallet[]>;

  abstract update(
    id: MainWallet['id'],
    payload: DeepPartial<MainWallet>,
  ): Promise<MainWallet | null>;

  abstract remove(id: MainWallet['id']): Promise<void>;
}
