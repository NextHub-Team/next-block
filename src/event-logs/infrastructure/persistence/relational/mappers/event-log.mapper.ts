import { EventLog } from '../../../../domain/event-log';

import { UserLogMapper } from '../../../../../user-logs/infrastructure/persistence/relational/mappers/user-log.mapper';

import { EventLogEntity } from '../entities/event-log.entity';

export class EventLogMapper {
	static toDomain(raw: EventLogEntity): EventLog {
		const domainEntity = new EventLog();
		domainEntity.status = raw.status;

		domainEntity.processed = raw.processed;

		domainEntity.newValue = raw.newValue;

		domainEntity.oldValue = raw.oldValue;

		domainEntity.property = raw.property;

		domainEntity.entity = raw.entity;

		if (raw.userLog) {
			domainEntity.userLog = UserLogMapper.toDomain(raw.userLog);
		}

		domainEntity.id = raw.id;
		domainEntity.createdAt = raw.createdAt;
		domainEntity.updatedAt = raw.updatedAt;

		return domainEntity;
	}

	static toPersistence(domainEntity: EventLog): EventLogEntity {
		const persistenceEntity = new EventLogEntity();
		persistenceEntity.status = domainEntity.status;

		persistenceEntity.processed = domainEntity.processed;

		persistenceEntity.newValue = domainEntity.newValue;

		persistenceEntity.oldValue = domainEntity.oldValue;

		persistenceEntity.property = domainEntity.property;

		persistenceEntity.entity = domainEntity.entity;

		if (domainEntity.userLog) {
			persistenceEntity.userLog = UserLogMapper.toPersistence(
				domainEntity.userLog,
			);
		}

		if (domainEntity.id) {
			persistenceEntity.id = domainEntity.id;
		}
		persistenceEntity.createdAt = domainEntity.createdAt;
		persistenceEntity.updatedAt = domainEntity.updatedAt;

		return persistenceEntity;
	}
}
