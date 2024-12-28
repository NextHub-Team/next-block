import { Notification } from '../../../../domain/notification';

import { DeviceMapper } from '../../../../../devices/infrastructure/persistence/relational/mappers/device.mapper';

import { NotificationEntity } from '../entities/notification.entity';

export class NotificationMapper {
	static toDomain(raw: NotificationEntity): Notification {
		const domainEntity = new Notification();
		domainEntity.scheduledAt = raw.scheduledAt;

		domainEntity.sentAt = raw.sentAt;

		domainEntity.isRead = raw.isRead;

		domainEntity.status = raw.status;

		domainEntity.priority = raw.priority;

		domainEntity.type = raw.type;

		if (raw.device) {
			domainEntity.device = DeviceMapper.toDomain(raw.device);
		}

		domainEntity.message = raw.message;

		domainEntity.title = raw.title;

		domainEntity.id = raw.id;
		domainEntity.createdAt = raw.createdAt;
		domainEntity.updatedAt = raw.updatedAt;

		return domainEntity;
	}

	static toPersistence(domainEntity: Notification): NotificationEntity {
		const persistenceEntity = new NotificationEntity();
		persistenceEntity.scheduledAt = domainEntity.scheduledAt;

		persistenceEntity.sentAt = domainEntity.sentAt;

		persistenceEntity.isRead = domainEntity.isRead;

		persistenceEntity.status = domainEntity.status;

		persistenceEntity.priority = domainEntity.priority;

		persistenceEntity.type = domainEntity.type;

		if (domainEntity.device) {
			persistenceEntity.device = DeviceMapper.toPersistence(
				domainEntity.device,
			);
		}

		persistenceEntity.message = domainEntity.message;

		persistenceEntity.title = domainEntity.title;

		if (domainEntity.id) {
			persistenceEntity.id = domainEntity.id;
		}
		persistenceEntity.createdAt = domainEntity.createdAt;
		persistenceEntity.updatedAt = domainEntity.updatedAt;

		return persistenceEntity;
	}
}
