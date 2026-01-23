import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options.type';
import { Account } from '../../domain/account';
import { User } from '../../../users/domain/user';

export abstract class AccountRepository {
  abstract create(
    data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Account>;

  abstract createMany(
    data: Array<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Account[]>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Account[]>;

  abstract findById(
    id: Account['id'],
    userId?: User['id'],
  ): Promise<NullableType<Account>>;

  abstract findByIds(ids: Account['id'][]): Promise<Account[]>;

  abstract findAllByUserId(userId: User['id']): Promise<Account[]>;

  abstract findByUserIdAndProviderName(
    userId: User['id'],
    providerName: Account['providerName'],
  ): Promise<NullableType<Account>>;

  abstract findByAccountId(
    accountId: Account['accountId'],
  ): Promise<NullableType<Account>>;

  abstract findByProviderName(
    providerName: Account['providerName'],
  ): Promise<Account[]>;

  abstract filter(
    userId?: User['id'],
    label?: Account['label'],
    status?: Account['status'],
    accountId?: Account['accountId'],
  ): Promise<Account[]>;

  abstract findActives(userId?: User['id']): Promise<Account[]>;

  abstract countAll(userId?: User['id']): Promise<number>;

  abstract countActives(userId?: User['id']): Promise<number>;

  abstract findByUserSocialId(socialId: User['socialId']): Promise<Account[]>;

  abstract findBySocialIdAndProviderName(
    socialId: User['socialId'],
    providerName: Account['providerName'],
  ): Promise<NullableType<Account>>;

  abstract findByName(name: Account['name']): Promise<NullableType<Account>>;

  abstract findBySocialId(
    userId: User['id'],
    socialId: User['socialId'],
    providerName: Account['providerName'],
  ): Promise<NullableType<Account>>;

  abstract update(
    id: Account['id'],
    payload: DeepPartial<Account>,
  ): Promise<NullableType<Account>>;

  abstract remove(id: Account['id']): Promise<void>;
}
