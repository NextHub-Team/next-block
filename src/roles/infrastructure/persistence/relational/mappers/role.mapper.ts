import { Role } from '../../../../domain/role';

import { RoleEntity } from '../entities/role.entity';

export class RoleMapper {
  static toDomain(raw: RoleEntity): Role {
    const domainEntity = new Role();
    domainEntity.description = raw.description;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Role): RoleEntity {
    const persistenceEntity = new RoleEntity();
    persistenceEntity.description = domainEntity.description;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
