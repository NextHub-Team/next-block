import { CustodialWallet } from '../../../../domain/custodial-wallet';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { CustodialWalletEntity } from '../entities/custodial-wallet.entity';

export class CustodialWalletMapper {
  static toDomain(raw: CustodialWalletEntity): CustodialWallet {
    const domainEntity = new CustodialWallet();
    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    domainEntity.name = raw.name;

    domainEntity.vaultId = raw.vaultId;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: CustodialWallet): CustodialWalletEntity {
    const persistenceEntity = new CustodialWalletEntity();
    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    }

    persistenceEntity.name = domainEntity.name;

    persistenceEntity.vaultId = domainEntity.vaultId;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
