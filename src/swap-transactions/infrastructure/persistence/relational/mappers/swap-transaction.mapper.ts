import { SwapTransaction } from '../../../../domain/swap-transaction';

import { SwapTransactionEntity } from '../entities/swap-transaction.entity';

export class SwapTransactionMapper {
  static toDomain(raw: SwapTransactionEntity): SwapTransaction {
    const domainEntity = new SwapTransaction();
    domainEntity.fee = raw.fee;

    domainEntity.dex = raw.dex;

    domainEntity.amountOut = raw.amountOut;

    domainEntity.amountIn = raw.amountIn;

    domainEntity.toToken = raw.toToken;

    domainEntity.wallet = raw.wallet;

    domainEntity.fromToken = raw.fromToken;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: SwapTransaction): SwapTransactionEntity {
    const persistenceEntity = new SwapTransactionEntity();
    persistenceEntity.fee = domainEntity.fee;

    persistenceEntity.dex = domainEntity.dex;

    persistenceEntity.amountOut = domainEntity.amountOut;

    persistenceEntity.amountIn = domainEntity.amountIn;

    persistenceEntity.toToken = domainEntity.toToken;

    persistenceEntity.wallet = domainEntity.wallet;

    persistenceEntity.fromToken = domainEntity.fromToken;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
