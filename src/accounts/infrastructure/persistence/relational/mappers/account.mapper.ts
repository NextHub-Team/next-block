import { Account } from '../../../../domain/account';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { AccountEntity } from '../entities/account.entity';

export class AccountMapper {
  static toDomain(raw: AccountEntity): Account {
    const domainEntity = new Account();
    domainEntity.KycStatus = raw.KycStatus;

    domainEntity.label = raw.label;

    domainEntity.metadata = raw.metadata;

    domainEntity.status = raw.status;

    domainEntity.providerAccountId = raw.providerAccountId;

    domainEntity.providerName = raw.providerName;

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Account): AccountEntity {
    const persistenceEntity = new AccountEntity();
    persistenceEntity.KycStatus = domainEntity.KycStatus;

    persistenceEntity.label = domainEntity.label;

    persistenceEntity.metadata = domainEntity.metadata;

    persistenceEntity.status = domainEntity.status;

    persistenceEntity.providerAccountId = domainEntity.providerAccountId;

    persistenceEntity.providerName = domainEntity.providerName;

    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
