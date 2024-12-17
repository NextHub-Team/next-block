import { SupportedAsset } from '../../../../domain/supported-asset';

import { SupportedAssetEntity } from '../entities/supported-asset.entity';

export class SupportedAssetMapper {
  static toDomain(raw: SupportedAssetEntity): SupportedAsset {
    const domainEntity = new SupportedAsset();
    domainEntity.protocol = raw.protocol;

    domainEntity.nativeAsset = raw.nativeAsset;

    domainEntity.issuerAddress = raw.issuerAddress;

    domainEntity.type = raw.type;

    domainEntity.decimals = raw.decimals;

    domainEntity.contractAddress = raw.contractAddress;

    domainEntity.blockchain = raw.blockchain;

    domainEntity.symbol = raw.symbol;

    domainEntity.name = raw.name;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: SupportedAsset): SupportedAssetEntity {
    const persistenceEntity = new SupportedAssetEntity();
    persistenceEntity.protocol = domainEntity.protocol;

    persistenceEntity.nativeAsset = domainEntity.nativeAsset;

    persistenceEntity.issuerAddress = domainEntity.issuerAddress;

    persistenceEntity.type = domainEntity.type;

    persistenceEntity.decimals = domainEntity.decimals;

    persistenceEntity.contractAddress = domainEntity.contractAddress;

    persistenceEntity.blockchain = domainEntity.blockchain;

    persistenceEntity.symbol = domainEntity.symbol;

    persistenceEntity.name = domainEntity.name;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
