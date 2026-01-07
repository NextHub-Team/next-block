import { AssetRegistry } from '../../../../domain/asset-registry';

import { AssetRegistryEntity } from '../entities/asset-registry.entity';

export class AssetRegistryMapper {
  static toDomain(raw: AssetRegistryEntity): AssetRegistry {
    const domainEntity = new AssetRegistry();
    domainEntity.description = raw.description;

    domainEntity.providerName = raw.providerName;

    domainEntity.envType = raw.envType;

    domainEntity.chainName = raw.chainName;

    domainEntity.assetId = raw.assetId;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: AssetRegistry): AssetRegistryEntity {
    const persistenceEntity = new AssetRegistryEntity();
    persistenceEntity.description = domainEntity.description;

    persistenceEntity.providerName = domainEntity.providerName;

    persistenceEntity.envType = domainEntity.envType;

    persistenceEntity.chainName = domainEntity.chainName;

    persistenceEntity.assetId = domainEntity.assetId;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
