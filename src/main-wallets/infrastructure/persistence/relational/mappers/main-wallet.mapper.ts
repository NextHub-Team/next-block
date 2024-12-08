import { MainWallet } from '../../../../domain/main-wallet';

import { WalletMapper } from '../../../../../wallets/infrastructure/persistence/relational/mappers/wallet.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { MainWalletEntity } from '../entities/main-wallet.entity';
import { PassphraseMapper } from '../../../../../passphrases/infrastructure/persistence/relational/mappers/passphrase.mapper';

export class MainWalletMapper {
  static toDomain(raw: MainWalletEntity): MainWallet {
    const domainEntity = new MainWallet();
    domainEntity.type = raw.type;

    domainEntity.name = raw.name;

    if (raw.wallets) {
      domainEntity.wallets = raw.wallets.map((item) =>
        WalletMapper.toDomain(item),
      );
    } else if (raw.wallets === null) {
      domainEntity.wallets = null;
    }

    domainEntity.address = raw.address;

    if (raw.passphrase) {
      domainEntity.passphrase = PassphraseMapper.toDomain(raw.passphrase);
    }

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: MainWallet): MainWalletEntity {
    const persistenceEntity = new MainWalletEntity();
    persistenceEntity.type = domainEntity.type;

    persistenceEntity.name = domainEntity.name;

    if (domainEntity.wallets) {
      persistenceEntity.wallets = domainEntity.wallets.map((item) =>
        WalletMapper.toPersistence(item),
      );
    } else if (domainEntity.wallets === null) {
      persistenceEntity.wallets = null;
    }

    persistenceEntity.address = domainEntity.address;

    if (domainEntity.passphrase) {
      persistenceEntity.passphrase = PassphraseMapper.toPersistence(
        domainEntity.passphrase,
      );
    }

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
