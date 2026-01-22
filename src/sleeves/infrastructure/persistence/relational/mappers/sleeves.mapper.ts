import { AssetRegistryMapper } from '../../../../../asset-registries/infrastructure/persistence/relational/mappers/asset-registry.mapper';

import { Sleeves } from '../../../../domain/sleeves';
import { SleevesEntity } from '../entities/sleeves.entity';

export class SleevesMapper {
  static toDomain(raw: SleevesEntity): Sleeves {
    const domainEntity = new Sleeves();
    domainEntity.contractName = raw.contractName;

    domainEntity.contractAddress = raw.contractAddress;

    if (raw.asset) {
      domainEntity.asset = AssetRegistryMapper.toDomain(raw.asset);
    }

    domainEntity.tag = raw.tag;

    domainEntity.name = raw.name;

    domainEntity.sleeveId = raw.sleeveId;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Sleeves): SleevesEntity {
    const persistenceEntity = new SleevesEntity();
    persistenceEntity.contractName = domainEntity.contractName;

    persistenceEntity.contractAddress = domainEntity.contractAddress;

    if (domainEntity.asset) {
      persistenceEntity.asset = AssetRegistryMapper.toPersistence(
        domainEntity.asset,
      );
    }

    persistenceEntity.tag = domainEntity.tag;

    persistenceEntity.name = domainEntity.name;

    persistenceEntity.sleeveId = domainEntity.sleeveId;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
