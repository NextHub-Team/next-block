import { Sleeves } from '../../../../domain/sleeves';

import { SleevesEntity } from '../entities/sleeves.entity';

export class SleevesMapper {
  static toDomain(raw: SleevesEntity): Sleeves {
    const domainEntity = new Sleeves();
    domainEntity.tag = raw.tag;

    domainEntity.chainName = raw.chainName;

    domainEntity.name = raw.name;

    domainEntity.contractAddress = raw.contractAddress;

    domainEntity.sleeveId = raw.sleeveId;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Sleeves): SleevesEntity {
    const persistenceEntity = new SleevesEntity();
    persistenceEntity.tag = domainEntity.tag;

    persistenceEntity.chainName = domainEntity.chainName;

    persistenceEntity.name = domainEntity.name;

    persistenceEntity.contractAddress = domainEntity.contractAddress;

    persistenceEntity.sleeveId = domainEntity.sleeveId;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
