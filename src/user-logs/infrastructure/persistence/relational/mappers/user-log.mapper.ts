import { UserLog } from '../../../../domain/user-log';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { UserLogEntity } from '../entities/user-log.entity';

export class UserLogMapper {
  static toDomain(raw: UserLogEntity): UserLog {
    const domainEntity = new UserLog();
    domainEntity.event = raw.event;
    domainEntity.details = raw.details;

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: UserLog): UserLogEntity {
    const persistenceEntity = new UserLogEntity();
    persistenceEntity.event = domainEntity.event;
    persistenceEntity.details = domainEntity.details;

    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
