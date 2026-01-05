import { Account } from '../../../../domain/account';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { AccountEntity } from '../entities/account.entity';

export class AccountMapper {
  static toDomain(raw: AccountEntity): Account {
    const domainEntity = new Account();
    domainEntity.customerRefId = raw.customerRefId;

    domainEntity.name = raw.name;

    domainEntity.KycStatus = raw.KycStatus;

    domainEntity.label = raw.label;

    domainEntity.status = raw.status;

    domainEntity.accountId = raw.accountId;

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
    persistenceEntity.customerRefId = domainEntity.customerRefId;

    persistenceEntity.name = domainEntity.name;

    persistenceEntity.KycStatus = domainEntity.KycStatus;

    persistenceEntity.label = domainEntity.label;

    persistenceEntity.status = domainEntity.status;

    persistenceEntity.accountId = domainEntity.accountId;

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
