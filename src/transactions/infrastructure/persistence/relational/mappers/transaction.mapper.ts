import { Transaction } from '../../../../domain/transaction';
import { WalletMapper } from '../../../../../wallets/infrastructure/persistence/relational/mappers/wallet.mapper';

import { TransactionEntity } from '../entities/transaction.entity';

export class TransactionMapper {
  static toDomain(raw: TransactionEntity): Transaction {
    const domainEntity = new Transaction();
    if (raw.wallet) {
      domainEntity.wallet = WalletMapper.toDomain(raw.wallet);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Transaction): TransactionEntity {
    const persistenceEntity = new TransactionEntity();
    if (domainEntity.wallet) {
      persistenceEntity.wallet = WalletMapper.toPersistence(
        domainEntity.wallet,
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