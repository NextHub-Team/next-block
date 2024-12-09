import { NftTransaction } from '../../../../domain/nft-transaction';
import { NftTransactionEntity } from '../entities/nft-transaction.entity';

export class NftTransactionMapper {
  static toDomain(raw: NftTransactionEntity): NftTransaction {
    const domainEntity = new NftTransaction();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: NftTransaction): NftTransactionEntity {
    const persistenceEntity = new NftTransactionEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
