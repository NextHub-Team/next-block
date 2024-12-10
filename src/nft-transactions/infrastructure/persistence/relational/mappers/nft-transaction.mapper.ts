import { NftTransaction } from '../../../../domain/nft-transaction';
import { NftMapper } from '../../../../../nfts/infrastructure/persistence/relational/mappers/nft.mapper';

import { TransactionMapper } from '../../../../../transactions/infrastructure/persistence/relational/mappers/transaction.mapper';
import { NftTransactionEntity } from '../entities/nft-transaction.entity';

export class NftTransactionMapper {
  static toDomain(raw: NftTransactionEntity): NftTransaction {
    const domainEntity = new NftTransaction();
    if (raw.nft) {
      domainEntity.nft = NftMapper.toDomain(raw.nft);
    }

    if (raw.transaction) {
      domainEntity.transaction = TransactionMapper.toDomain(raw.transaction);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: NftTransaction): NftTransactionEntity {
    const persistenceEntity = new NftTransactionEntity();
    if (domainEntity.nft) {
      persistenceEntity.nft = NftMapper.toPersistence(domainEntity.nft);
    }

    if (domainEntity.transaction) {
      persistenceEntity.transaction = TransactionMapper.toPersistence(
        domainEntity.transaction,
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
