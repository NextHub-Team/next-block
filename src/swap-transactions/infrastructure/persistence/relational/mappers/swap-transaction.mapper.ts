import { SwapTransaction } from '../../../../domain/swap-transaction';
import { SwapTransactionEntity } from '../entities/swap-transaction.entity';

export class SwapTransactionMapper {
  static toDomain(raw: SwapTransactionEntity): SwapTransaction {
    const domainEntity = new SwapTransaction();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: SwapTransaction): SwapTransactionEntity {
    const persistenceEntity = new SwapTransactionEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
