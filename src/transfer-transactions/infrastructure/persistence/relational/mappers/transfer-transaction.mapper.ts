import { TransferTransaction } from '../../../../domain/transfer-transaction';
import { TransactionMapper } from '../../../../../transactions/infrastructure/persistence/relational/mappers/transaction.mapper';

import { TransferTransactionEntity } from '../entities/transfer-transaction.entity';

export class TransferTransactionMapper {
  static toDomain(raw: TransferTransactionEntity): TransferTransaction {
    const domainEntity = new TransferTransaction();
    if (raw.transaction) {
      domainEntity.transaction = TransactionMapper.toDomain(raw.transaction);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: TransferTransaction,
  ): TransferTransactionEntity {
    const persistenceEntity = new TransferTransactionEntity();
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
