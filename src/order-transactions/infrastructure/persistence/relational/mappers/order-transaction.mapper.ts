import { OrderTransaction } from '../../../../domain/order-transaction';
import { TransactionMapper } from '../../../../../transactions/infrastructure/persistence/relational/mappers/transaction.mapper';

import { OrderTransactionEntity } from '../entities/order-transaction.entity';

export class OrderTransactionMapper {
  static toDomain(raw: OrderTransactionEntity): OrderTransaction {
    const domainEntity = new OrderTransaction();
    if (raw.transaction) {
      domainEntity.transaction = TransactionMapper.toDomain(raw.transaction);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: OrderTransaction): OrderTransactionEntity {
    const persistenceEntity = new OrderTransactionEntity();
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
