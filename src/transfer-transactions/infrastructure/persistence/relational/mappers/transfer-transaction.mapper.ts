import { TransferTransaction } from '../../../../domain/transfer-transaction';
import { TransferTransactionEntity } from '../entities/transfer-transaction.entity';

export class TransferTransactionMapper {
  static toDomain(raw: TransferTransactionEntity): TransferTransaction {
    const domainEntity = new TransferTransaction();
    domainEntity.fromAddress = raw.fromAddress;

    domainEntity.toAddress = raw.toAddress;

    domainEntity.fee = raw.fee;

    domainEntity.amount = raw.amount;

    domainEntity.blockchain = raw.blockchain;

    domainEntity.transactionHash = raw.transactionHash;

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
    persistenceEntity.fromAddress = domainEntity.fromAddress;

    persistenceEntity.toAddress = domainEntity.toAddress;

    persistenceEntity.fee = domainEntity.fee;

    persistenceEntity.amount = domainEntity.amount;

    persistenceEntity.blockchain = domainEntity.blockchain;

    persistenceEntity.transactionHash = domainEntity.transactionHash;

    persistenceEntity.wallet = domainEntity.wallet;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
