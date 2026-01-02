import { Sleeves } from '../../../../domain/sleeves';
import { SleevesEntity } from '../entities/sleeves.entity';

export class SleevesMapper {
  static toDomain(raw: SleevesEntity): Sleeves {
    const domainEntity = new Sleeves();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Sleeves): SleevesEntity {
    const persistenceEntity = new SleevesEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
