import { Nft } from '../../../../domain/nft';

import { NftTransactionMapper } from '../../../../../nft-transactions/infrastructure/persistence/relational/mappers/nft-transaction.mapper';

import { WalletMapper } from '../../../../../wallets/infrastructure/persistence/relational/mappers/wallet.mapper';

import { NftEntity } from '../entities/nft.entity';

export class NftMapper {
  static toDomain(raw: NftEntity): Nft {
    const domainEntity = new Nft();
    domainEntity.attributes = raw.attributes;

    domainEntity.OwnerAddress = raw.OwnerAddress;

    domainEntity.name = raw.name;

    domainEntity.objectUri = raw.objectUri;

    domainEntity.metadataUri = raw.metadataUri;

    domainEntity.contractAddress = raw.contractAddress;

    domainEntity.blockchain = raw.blockchain;

    domainEntity.token = raw.token;

    if (raw.nftTransactions) {
      domainEntity.nftTransactions = raw.nftTransactions.map((item) =>
        NftTransactionMapper.toDomain(item),
      );
    } else if (raw.nftTransactions === null) {
      domainEntity.nftTransactions = null;
    }

    if (raw.wallet) {
      domainEntity.wallet = WalletMapper.toDomain(raw.wallet);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Nft): NftEntity {
    const persistenceEntity = new NftEntity();
    persistenceEntity.attributes = domainEntity.attributes;

    persistenceEntity.OwnerAddress = domainEntity.OwnerAddress;

    persistenceEntity.name = domainEntity.name;

    persistenceEntity.objectUri = domainEntity.objectUri;

    persistenceEntity.metadataUri = domainEntity.metadataUri;

    persistenceEntity.contractAddress = domainEntity.contractAddress;

    persistenceEntity.blockchain = domainEntity.blockchain;

    persistenceEntity.token = domainEntity.token;

    if (domainEntity.nftTransactions) {
      persistenceEntity.nftTransactions = domainEntity.nftTransactions.map(
        (item) => NftTransactionMapper.toPersistence(item),
      );
    } else if (domainEntity.nftTransactions === null) {
      persistenceEntity.nftTransactions = null;
    }

    if (domainEntity.wallet) {
      persistenceEntity.wallet = WalletMapper.toPersistence(
        domainEntity.wallet,
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
