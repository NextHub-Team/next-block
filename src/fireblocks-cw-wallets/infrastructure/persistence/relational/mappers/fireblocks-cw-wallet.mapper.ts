import { FireblocksCwWallet } from '../../../../domain/fireblocks-cw-wallet';
import { AccountMapper } from '../../../../../accounts/infrastructure/persistence/relational/mappers/account.mapper';

import { FireblocksCwWalletEntity } from '../entities/fireblocks-cw-wallet.entity';

export class FireblocksCwWalletMapper {
  static toDomain(raw: FireblocksCwWalletEntity): FireblocksCwWallet {
    const domainEntity = new FireblocksCwWallet();
    if (raw.account) {
      domainEntity.account = AccountMapper.toDomain(raw.account);
    }

    domainEntity.assetId = raw.assetId;
    domainEntity.address = raw.address;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: FireblocksCwWallet,
  ): FireblocksCwWalletEntity {
    const persistenceEntity = new FireblocksCwWalletEntity();
    if (domainEntity.account) {
      persistenceEntity.account = AccountMapper.toPersistence(
        domainEntity.account,
      );
    }

    persistenceEntity.assetId = domainEntity.assetId;
    persistenceEntity.address = domainEntity.address;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
