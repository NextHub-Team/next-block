import { SwapTransaction } from '../../../../domain/swap-transaction';
import { TransactionMapper } from '../../../../../transactions/infrastructure/persistence/relational/mappers/transaction.mapper';

import { SwapTransactionEntity } from '../entities/swap-transaction.entity';

export class SwapTransactionMapper {
  static toDomain(raw: SwapTransactionEntity): SwapTransaction {
    const domainEntity = new SwapTransaction();
    if (raw.transaction) {
      domainEntity.transaction = TransactionMapper.toDomain(raw.transaction);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: SwapTransaction): SwapTransactionEntity {
    const persistenceEntity = new SwapTransactionEntity();
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
