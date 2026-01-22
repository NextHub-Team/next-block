import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Account } from '../../../../domain/account';
import { AccountRepository } from '../../account.repository';
import { AccountMapper } from '../mappers/account.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { User } from '../../../../../users/domain/user';
import {
  AccountProviderName,
  AccountStatus,
} from '../../../../types/account-enum.type';
import { buildVaultName } from 'src/providers/fireblocks/cw/helpers/fireblocks-cw.helper';
import { isEmpty } from 'src/utils/helpers/string.helper';

@Injectable()
export class AccountRelationalRepository implements AccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async create(data: Account): Promise<Account> {
    const persistenceModel = AccountMapper.toPersistence(data);
    const newEntity = await this.accountRepository.save(
      this.accountRepository.create(persistenceModel),
    );
    return AccountMapper.toDomain(newEntity);
  }

  async createMany(
    data: Array<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Account[]> {
    if (!data?.length) {
      return [];
    }

    const persistenceModels = data.map((account) =>
      this.accountRepository.create(
        AccountMapper.toPersistence(account as Account),
      ),
    );
    const entities = await this.accountRepository.save(persistenceModels);

    return entities.map((entity) => AccountMapper.toDomain(entity));
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Account[]> {
    const entities = await this.accountRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => AccountMapper.toDomain(entity));
  }

  async findById(
    id: Account['id'],
    userId?: User['id'],
  ): Promise<NullableType<Account>> {
    const whereClause: any = { id };

    if (typeof userId !== 'undefined') {
      whereClause.user = { id: Number(userId) };
    }

    const entity = await this.accountRepository.findOne({
      where: whereClause,
    });

    return entity ? AccountMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Account['id'][]): Promise<Account[]> {
    const entities = await this.accountRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => AccountMapper.toDomain(entity));
  }

  async findAllByUserId(userId: User['id']): Promise<Account[]> {
    const entities = await this.accountRepository.find({
      where: {
        user: {
          id: Number(userId),
        },
      },
    });

    return entities.map((entity) => AccountMapper.toDomain(entity));
  }

  async findByUserIdAndProviderName(
    userId: User['id'],
    providerName: Account['providerName'],
  ): Promise<NullableType<Account>> {
    const entity = await this.accountRepository.findOne({
      where: {
        user: {
          id: Number(userId),
        },
        providerName,
      },
    });

    return entity ? AccountMapper.toDomain(entity) : null;
  }

  async findByAccountId(
    accountId: Account['accountId'],
  ): Promise<NullableType<Account>> {
    const entity = await this.accountRepository.findOne({
      where: { accountId },
    });

    return entity ? AccountMapper.toDomain(entity) : null;
  }

  async findByProviderName(
    providerName: Account['providerName'],
  ): Promise<Account[]> {
    const entities = await this.accountRepository.find({
      where: { providerName },
    });

    return entities.map((entity) => AccountMapper.toDomain(entity));
  }

  async filter(
    userId?: User['id'],
    label?: Account['label'],
    status?: Account['status'],
    accountId?: Account['accountId'],
  ): Promise<Account[]> {
    const whereClause: any = {};

    if (typeof userId !== 'undefined') {
      whereClause.user = { id: Number(userId) };
    }
    if (typeof label !== 'undefined') {
      whereClause.label = label;
    }
    if (typeof status !== 'undefined') {
      whereClause.status = status;
    }
    if (typeof accountId !== 'undefined') {
      whereClause.accountId = accountId;
    }

    const entities = await this.accountRepository.find({
      where: whereClause,
    });

    return entities.map((entity) => AccountMapper.toDomain(entity));
  }

  async findActives(userId?: User['id']): Promise<Account[]> {
    const whereClause: any = {
      status: AccountStatus.ACTIVE,
    };

    if (typeof userId !== 'undefined') {
      whereClause.user = { id: Number(userId) };
    }

    const entities = await this.accountRepository.find({
      where: whereClause,
    });

    return entities.map((entity) => AccountMapper.toDomain(entity));
  }

  async countAll(userId?: User['id']): Promise<number> {
    const whereClause: any = {};

    if (typeof userId !== 'undefined') {
      whereClause.user = { id: Number(userId) };
    }

    return this.accountRepository.count({
      where: whereClause,
    });
  }

  async countActives(userId?: User['id']): Promise<number> {
    const whereClause: any = {
      status: AccountStatus.ACTIVE,
    };

    if (typeof userId !== 'undefined') {
      whereClause.user = { id: Number(userId) };
    }

    return this.accountRepository.count({
      where: whereClause,
    });
  }

  async findByUserSocialId(socialId: User['socialId']): Promise<Account[]> {
    if (!socialId) {
      return [];
    }

    const entities = await this.accountRepository.find({
      where: {
        user: {
          socialId,
        },
      },
    });

    return entities.map((entity) => AccountMapper.toDomain(entity));
  }

  async findBySocialIdAndProviderName(
    socialId: User['socialId'],
    providerName: Account['providerName'],
  ): Promise<NullableType<Account>> {
    if (!socialId || !providerName) {
      return null;
    }

    const entity = await this.accountRepository.findOne({
      where: {
        user: {
          socialId,
        },
        providerName,
      },
    });

    return entity ? AccountMapper.toDomain(entity) : null;
  }

  async findByName(name: Account['name']): Promise<NullableType<Account>> {
    if (!name) {
      return null;
    }

    const entity = await this.accountRepository.findOne({
      where: {
        name,
      },
    });

    return entity ? AccountMapper.toDomain(entity) : null;
  }

  async findBySocialId(
    userId: User['id'],
    socialId: User['socialId'],
    providerName: Account['providerName'],
  ): Promise<NullableType<Account>> {
    if (!socialId || !providerName) {
      return null;
    }
    let name = '';

    switch (providerName) {
      case AccountProviderName.FIREBLOCKS:
        name = buildVaultName(userId, socialId);
        break;

      default:
        break;
    }

    const entity = await this.accountRepository.findOne({
      where: isEmpty(name)
        ? {
            user: {
              socialId,
            },
            providerName,
          }
        : {
            user: {
              socialId,
            },
            name,
            providerName,
          },
    });

    return entity ? AccountMapper.toDomain(entity) : null;
  }

  async update(
    id: Account['id'],
    payload: Partial<Account>,
  ): Promise<NullableType<Account>> {
    const entity = await this.accountRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    const updatedEntity = await this.accountRepository.save(
      this.accountRepository.create(
        AccountMapper.toPersistence({
          ...AccountMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return AccountMapper.toDomain(updatedEntity);
  }

  async remove(id: Account['id']): Promise<void> {
    await this.accountRepository.delete(id);
  }
}
