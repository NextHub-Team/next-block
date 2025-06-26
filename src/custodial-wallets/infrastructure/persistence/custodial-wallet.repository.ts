import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { CustodialWallet } from '../../domain/custodial-wallet';

export abstract class CustodialWalletRepository {
  abstract create(
    data: Omit<CustodialWallet, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CustodialWallet>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<CustodialWallet[]>;

  abstract findById(
    id: CustodialWallet['id'],
  ): Promise<NullableType<CustodialWallet>>;

  abstract findByIds(ids: CustodialWallet['id'][]): Promise<CustodialWallet[]>;

  abstract update(
    id: CustodialWallet['id'],
    payload: DeepPartial<CustodialWallet>,
  ): Promise<CustodialWallet | null>;

  abstract remove(id: CustodialWallet['id']): Promise<void>;
  abstract findByName(name: string): Promise<NullableType<CustodialWallet>>;
  abstract findByNames(names: string[]): Promise<CustodialWallet[]>;
  abstract findByUserId(userId: number): Promise<NullableType<CustodialWallet>>;
  abstract findByUserIds(userId: number): Promise<CustodialWallet[]>;
  abstract findByUserSocialId(
    socialId: string,
  ): Promise<NullableType<CustodialWallet>>;
}
