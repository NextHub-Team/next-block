import { Wallet } from '../../../../domain/wallet';
import { TransactionMapper } from '../../../../../transactions/infrastructure/persistence/relational/mappers/transaction.mapper';

import { MainWalletMapper } from '../../../../../main-wallets/infrastructure/persistence/relational/mappers/main-wallet.mapper';

import { WalletEntity } from '../entities/wallet.entity';

export class WalletMapper {
  static toDomain(raw: WalletEntity): Wallet {
    const domainEntity = new Wallet();
    if (raw.transactions) {
      domainEntity.transactions = raw.transactions.map((item) =>
        TransactionMapper.toDomain(item),
      );
    } else if (raw.transactions === null) {
      domainEntity.transactions = null;
    }

    domainEntity.legacyAddress = raw.legacyAddress;

    domainEntity.blockchain = raw.blockchain;

    domainEntity.address = raw.address;

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
    if (domainEntity.transactions) {
      persistenceEntity.transactions = domainEntity.transactions.map((item) =>
        TransactionMapper.toPersistence(item),
      );
    } else if (domainEntity.transactions === null) {
      persistenceEntity.transactions = null;
    }

    persistenceEntity.legacyAddress = domainEntity.legacyAddress;

    persistenceEntity.blockchain = domainEntity.blockchain;

    persistenceEntity.address = domainEntity.address;

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
