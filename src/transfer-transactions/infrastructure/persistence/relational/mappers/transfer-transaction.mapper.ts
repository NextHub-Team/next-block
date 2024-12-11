import { TransferTransaction } from '../../../../domain/transfer-transaction';
import { TransferTransactionEntity } from '../entities/transfer-transaction.entity';

export class TransferTransactionMapper {
  static toDomain(raw: TransferTransactionEntity): TransferTransaction {
    const domainEntity = new TransferTransaction();
    domainEntity.from_address = raw.from_address;

    domainEntity.to_address = raw.to_address;

    domainEntity.transaction_fee = raw.transaction_fee;

    domainEntity.amount = raw.amount;

    domainEntity.blockchain = raw.blockchain;

    domainEntity.transaction_hash = raw.transaction_hash;

    domainEntity.wallet = raw.wallet;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: TransferTransaction,
  ): TransferTransactionEntity {
    const persistenceEntity = new TransferTransactionEntity();
    persistenceEntity.from_address = domainEntity.from_address;

    persistenceEntity.to_address = domainEntity.to_address;

    persistenceEntity.transaction_fee = domainEntity.transaction_fee;

    persistenceEntity.amount = domainEntity.amount;

    persistenceEntity.blockchain = domainEntity.blockchain;

    persistenceEntity.transaction_hash = domainEntity.transaction_hash;

    persistenceEntity.wallet = domainEntity.wallet;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
