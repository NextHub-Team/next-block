import { Status } from '../../../../domain/status';
import { StatusEntity } from '../entities/status.entity';

export class StatusMapper {
  static toDomain(raw: StatusEntity): Status {
    const domainEntity = new Status();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Status): StatusEntity {
    const persistenceEntity = new StatusEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
