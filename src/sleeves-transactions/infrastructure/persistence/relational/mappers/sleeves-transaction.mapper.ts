import { SleevesTransaction } from '../../../../domain/sleeves-transaction';
import { SleevesTransactionEntity } from '../entities/sleeves-transaction.entity';

export class SleevesTransactionMapper {
  static toDomain(raw: SleevesTransactionEntity): SleevesTransaction {
    const domainEntity = new SleevesTransaction();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: SleevesTransaction,
  ): SleevesTransactionEntity {
    const persistenceEntity = new SleevesTransactionEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
