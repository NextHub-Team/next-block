import { SwapTransaction } from '../../../../domain/swap-transaction';

import { SwapTransactionEntity } from '../entities/swap-transaction.entity';

export class SwapTransactionMapper {
  static toDomain(raw: SwapTransactionEntity): SwapTransaction {
    const domainEntity = new SwapTransaction();
    domainEntity.fee = raw.fee;

    domainEntity.dex = raw.dex;

    domainEntity.amount_out = raw.amount_out;

    domainEntity.amount_in = raw.amount_in;

    domainEntity.to_token = raw.to_token;

    domainEntity.wallet = raw.wallet;

    domainEntity.from_token = raw.from_token;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: SwapTransaction): SwapTransactionEntity {
    const persistenceEntity = new SwapTransactionEntity();
    persistenceEntity.fee = domainEntity.fee;

    persistenceEntity.dex = domainEntity.dex;

    persistenceEntity.amount_out = domainEntity.amount_out;

    persistenceEntity.amount_in = domainEntity.amount_in;

    persistenceEntity.to_token = domainEntity.to_token;

    persistenceEntity.wallet = domainEntity.wallet;

    persistenceEntity.from_token = domainEntity.from_token;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
