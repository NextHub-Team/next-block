import { MainWallet } from '../../../../domain/main-wallet';
import { MainWalletEntity } from '../entities/main-wallet.entity';

export class MainWalletMapper {
  static toDomain(raw: MainWalletEntity): MainWallet {
    const domainEntity = new MainWallet();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: MainWallet): MainWalletEntity {
    const persistenceEntity = new MainWalletEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
