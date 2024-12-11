import { TransactionLog } from '../../../../domain/transaction-log';
import { WalletMapper } from '../../../../../wallets/infrastructure/persistence/relational/mappers/wallet.mapper';

import { TransactionLogEntity } from '../entities/transaction-log.entity';

export class TransactionLogMapper {
  static toDomain(raw: TransactionLogEntity): TransactionLog {
    const domainEntity = new TransactionLog();
    if (raw.wallet) {
      domainEntity.wallet = WalletMapper.toDomain(raw.wallet);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: TransactionLog): TransactionLogEntity {
    const persistenceEntity = new TransactionLogEntity();
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
