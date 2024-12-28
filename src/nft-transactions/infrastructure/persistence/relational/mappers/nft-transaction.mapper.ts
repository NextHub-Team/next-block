import { NftTransaction } from '../../../../domain/nft-transaction';

import { NftMapper } from '../../../../../nfts/infrastructure/persistence/relational/mappers/nft.mapper';
import { NftTransactionEntity } from '../entities/nft-transaction.entity';

export class NftTransactionMapper {
  static toDomain(raw: NftTransactionEntity): NftTransaction {
    const domainEntity = new NftTransaction();
    domainEntity.fee = raw.fee;

    domainEntity.transactionHash = raw.transactionHash;

    domainEntity.toAddress = raw.toAddress;

    domainEntity.fromAddress = raw.fromAddress;

    domainEntity.contractAddress = raw.contractAddress;

    domainEntity.blockchain = raw.blockchain;

    domainEntity.wallet = raw.wallet;

    if (raw.nft) {
      domainEntity.nft = NftMapper.toDomain(raw.nft);
    }
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: NftTransaction): NftTransactionEntity {
    const persistenceEntity = new NftTransactionEntity();
    persistenceEntity.fee = domainEntity.fee;

    persistenceEntity.transactionHash = domainEntity.transactionHash;

    persistenceEntity.toAddress = domainEntity.toAddress;

    persistenceEntity.fromAddress = domainEntity.fromAddress;

    persistenceEntity.contractAddress = domainEntity.contractAddress;

    persistenceEntity.blockchain = domainEntity.blockchain;

    persistenceEntity.wallet = domainEntity.wallet;

    if (domainEntity.nft) {
      persistenceEntity.nft = NftMapper.toPersistence(domainEntity.nft);
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
