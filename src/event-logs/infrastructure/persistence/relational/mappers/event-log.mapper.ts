import { EventLog } from '../../../../domain/event-log';
import { EventLogEntity } from '../entities/event-log.entity';

export class EventLogMapper {
  static toDomain(raw: EventLogEntity): EventLog {
    const domainEntity = new EventLog();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: EventLog): EventLogEntity {
    const persistenceEntity = new EventLogEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
