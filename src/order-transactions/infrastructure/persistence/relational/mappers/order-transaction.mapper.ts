import { OrderTransaction } from '../../../../domain/order-transaction';

import { OrderTransactionEntity } from '../entities/order-transaction.entity';

export class OrderTransactionMapper {
  static toDomain(raw: OrderTransactionEntity): OrderTransaction {
    const domainEntity = new OrderTransaction();
    domainEntity.type = raw.type;

    domainEntity.fee = raw.fee;

    domainEntity.paymentMethod = raw.paymentMethod;

    domainEntity.totalValue = raw.totalValue;

    domainEntity.price = raw.price;

    domainEntity.cryptoAmount = raw.cryptoAmount;

    domainEntity.currencyAmount = raw.currencyAmount;

    domainEntity.wallet = raw.wallet;

    domainEntity.wallet = raw.wallet;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: OrderTransaction): OrderTransactionEntity {
    const persistenceEntity = new OrderTransactionEntity();
    persistenceEntity.type = domainEntity.type;

    persistenceEntity.fee = domainEntity.fee;

    persistenceEntity.paymentMethod = domainEntity.paymentMethod;

    persistenceEntity.totalValue = domainEntity.totalValue;

    persistenceEntity.price = domainEntity.price;

    persistenceEntity.cryptoAmount = domainEntity.cryptoAmount;

    persistenceEntity.currencyAmount = domainEntity.currencyAmount;

    persistenceEntity.wallet = domainEntity.wallet;

    persistenceEntity.wallet = domainEntity.wallet;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
