import { Device } from '../../../../domain/device';
import { NotificationMapper } from '../../../../../notifications/infrastructure/persistence/relational/mappers/notification.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { DeviceEntity } from '../entities/device.entity';

export class DeviceMapper {
  static toDomain(raw: DeviceEntity): Device {
    const domainEntity = new Device();
    if (raw.notifications) {
      domainEntity.notifications = raw.notifications.map((item) =>
        NotificationMapper.toDomain(item),
      );
    } else if (raw.notifications === null) {
      domainEntity.notifications = null;
    }

    domainEntity.name = raw.name;

    domainEntity.physicalId = raw.physicalId;

    domainEntity.type = raw.type;

    domainEntity.token = raw.token;

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Device): DeviceEntity {
    const persistenceEntity = new DeviceEntity();
    if (domainEntity.notifications) {
      persistenceEntity.notifications = domainEntity.notifications.map((item) =>
        NotificationMapper.toPersistence(item),
      );
    } else if (domainEntity.notifications === null) {
      persistenceEntity.notifications = null;
    }

    persistenceEntity.name = domainEntity.name;

    persistenceEntity.physicalId = domainEntity.physicalId;

    persistenceEntity.type = domainEntity.type;

    persistenceEntity.token = domainEntity.token;

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
