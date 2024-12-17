import { TransactionLog } from '../../../../domain/transaction-log';

import { WalletMapper } from '../../../../../wallets/infrastructure/persistence/relational/mappers/wallet.mapper';
import { TransactionLogEntity } from '../entities/transaction-log.entity';

export class TransactionLogMapper {
  static toDomain(raw: TransactionLogEntity): TransactionLog {
    const domainEntity = new TransactionLog();
    domainEntity.details = raw.details;

    domainEntity.priority = raw.priority;
    domainEntity.status = raw.status;
    domainEntity.type = raw.type;
    domainEntity.assetName = raw.assetName;

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
    persistenceEntity.details = domainEntity.details;

    persistenceEntity.priority = domainEntity.priority;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.type = domainEntity.type;
    persistenceEntity.assetName = domainEntity.assetName;

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
