import { AccessControl } from '../../../../domain/access-control';
import { AccessControlEntity } from '../entities/access-control.entity';

export class AccessControlMapper {
  static toDomain(raw: AccessControlEntity): AccessControl {
    const domainEntity = new AccessControl();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: AccessControl): AccessControlEntity {
    const persistenceEntity = new AccessControlEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
