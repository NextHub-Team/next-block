import { Permission } from '../../../../domain/permission';
import { PermissionEntity } from '../entities/permission.entity';

export class PermissionMapper {
  static toDomain(raw: PermissionEntity): Permission {
    const domainEntity = new Permission();

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Permission): PermissionEntity {
    const persistenceEntity = new PermissionEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
