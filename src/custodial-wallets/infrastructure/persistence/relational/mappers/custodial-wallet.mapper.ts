import { CustodialWallet } from '../../../../domain/custodial-wallet';
import { CustodialWalletEntity } from '../entities/custodial-wallet.entity';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

export class CustodialWalletMapper {
  static toDomain(raw: CustodialWalletEntity): CustodialWallet {
    const domainEntity = new CustodialWallet();

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    domainEntity.vaultId = raw.vaultId;
    domainEntity.custodialAddress = raw.custodialAddress;
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

    persistenceEntity.vaultId = domainEntity.vaultId;
    persistenceEntity.custodialAddress = domainEntity.custodialAddress;
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
