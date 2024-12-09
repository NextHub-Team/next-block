import { OrderTransaction } from '../../../../domain/order-transaction';
import { OrderTransactionEntity } from '../entities/order-transaction.entity';

export class OrderTransactionMapper {
  static toDomain(raw: OrderTransactionEntity): OrderTransaction {
    const domainEntity = new OrderTransaction();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: OrderTransaction): OrderTransactionEntity {
    const persistenceEntity = new OrderTransactionEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
