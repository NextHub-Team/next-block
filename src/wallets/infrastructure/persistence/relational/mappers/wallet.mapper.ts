import { Wallet } from '../../../../domain/wallet';

import { TransactionLogMapper } from '../../../../../transaction-logs/infrastructure/persistence/relational/mappers/transaction-log.mapper';

import { NftMapper } from '../../../../../nfts/infrastructure/persistence/relational/mappers/nft.mapper';

import { MainWalletMapper } from '../../../../../main-wallets/infrastructure/persistence/relational/mappers/main-wallet.mapper';

import { WalletEntity } from '../entities/wallet.entity';

export class WalletMapper {
  static toDomain(raw: WalletEntity): Wallet {
    const domainEntity = new Wallet();
    domainEntity.details = raw.details;

    if (raw.transactionLog) {
      domainEntity.transactionLog = raw.transactionLog.map((item) =>
        TransactionLogMapper.toDomain(item),
      );
    } else if (raw.transactionLog === null) {
      domainEntity.transactionLog = null;
    }

    if (raw.nfts) {
      domainEntity.nfts = raw.nfts.map((item) => NftMapper.toDomain(item));
    } else if (raw.nfts === null) {
      domainEntity.nfts = null;
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
    persistenceEntity.details = domainEntity.details;

    if (domainEntity.transactionLog) {
      persistenceEntity.transactionLog = domainEntity.transactionLog.map(
        (item) => TransactionLogMapper.toPersistence(item),
      );
    } else if (domainEntity.transactionLog === null) {
      persistenceEntity.transactionLog = null;
    }

    if (domainEntity.nfts) {
      persistenceEntity.nfts = domainEntity.nfts.map((item) =>
        NftMapper.toPersistence(item),
      );
    } else if (domainEntity.nfts === null) {
      persistenceEntity.nfts = null;
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
