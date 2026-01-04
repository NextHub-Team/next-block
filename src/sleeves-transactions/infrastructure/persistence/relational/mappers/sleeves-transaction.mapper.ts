import { SleevesTransaction } from '../../../../domain/sleeves-transaction';
import { FireblocksCwWalletMapper } from '../../../../../fireblocks-cw-wallets/infrastructure/persistence/relational/mappers/fireblocks-cw-wallet.mapper';

import { SleevesMapper } from '../../../../../sleeves/infrastructure/persistence/relational/mappers/sleeves.mapper';

import { SleevesTransactionEntity } from '../entities/sleeves-transaction.entity';
import {
  SleevesTransactionPointType,
  SleevesTransactionType,
} from '../../../../types/sleeves-transaction-enum.type';

export class SleevesTransactionMapper {
  static toDomain(raw: SleevesTransactionEntity): SleevesTransaction {
    const domainEntity = new SleevesTransaction();
    if (raw.wallet) {
      domainEntity.wallet = FireblocksCwWalletMapper.toDomain(raw.wallet);
    }

    domainEntity.type = raw.type ?? SleevesTransactionType.TRANSFER_IN;

    domainEntity.pointType =
      raw.pointType ?? SleevesTransactionPointType.REWARD;

    domainEntity.txHash = raw.txHash;

    domainEntity.pointCount = raw.pointCount;

    domainEntity.blockNumber = raw.blockNumber;

    if (raw.sleeve) {
      domainEntity.sleeve = SleevesMapper.toDomain(raw.sleeve);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: SleevesTransaction,
  ): SleevesTransactionEntity {
    const persistenceEntity = new SleevesTransactionEntity();
    if (domainEntity.wallet) {
      persistenceEntity.wallet = FireblocksCwWalletMapper.toPersistence(
        domainEntity.wallet,
      );
    }

    persistenceEntity.type =
      domainEntity.type ?? SleevesTransactionType.TRANSFER_IN;

    persistenceEntity.pointType =
      domainEntity.pointType ?? SleevesTransactionPointType.REWARD;

    persistenceEntity.txHash = domainEntity.txHash;

    persistenceEntity.pointCount = domainEntity.pointCount;

    persistenceEntity.blockNumber = domainEntity.blockNumber;

    if (domainEntity.sleeve) {
      persistenceEntity.sleeve = SleevesMapper.toPersistence(
        domainEntity.sleeve,
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
