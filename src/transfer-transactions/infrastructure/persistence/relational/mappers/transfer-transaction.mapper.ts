import { TransferTransaction } from '../../../../domain/transfer-transaction';
import { TransferTransactionEntity } from '../entities/transfer-transaction.entity';

export class TransferTransactionMapper {
  static toDomain(raw: TransferTransactionEntity): TransferTransaction {
    const domainEntity = new TransferTransaction();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: TransferTransaction,
  ): TransferTransactionEntity {
    const persistenceEntity = new TransferTransactionEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
