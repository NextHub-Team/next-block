import { Wallet } from '../../../../domain/wallet';
import { MainWalletMapper } from '../../../../../main-wallets/infrastructure/persistence/relational/mappers/main-wallet.mapper';

import { WalletEntity } from '../entities/wallet.entity';

export class WalletMapper {
  static toDomain(raw: WalletEntity): Wallet {
    const domainEntity = new Wallet();
    if (raw.mainWallet) {
      domainEntity.mainWallet = MainWalletMapper.toDomain(raw.mainWallet);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Wallet): WalletEntity {
    const persistenceEntity = new WalletEntity();
    if (domainEntity.mainWallet) {
      persistenceEntity.mainWallet = MainWalletMapper.toPersistence(
        domainEntity.mainWallet,
      );
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
