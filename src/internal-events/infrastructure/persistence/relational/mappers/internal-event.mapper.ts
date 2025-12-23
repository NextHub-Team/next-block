import { InternalEvent } from '../../../../domain/internal-event';

import { InternalEventEntity } from '../entities/internal-event.entity';

export class InternalEventMapper {
  static toDomain(raw: InternalEventEntity): InternalEvent {
    const domainEntity = new InternalEvent();
    domainEntity.payload = raw.payload ?? {};
    domainEntity.eventId = raw.id;
    domainEntity.eventType = raw.eventType;
    domainEntity.publishedAt = raw.publishedAt ?? null;
    domainEntity.occurredAt = raw.createdAt;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: InternalEvent): InternalEventEntity {
    const persistenceEntity = new InternalEventEntity();
    persistenceEntity.payload = domainEntity.payload ?? {};
    persistenceEntity.eventType = domainEntity.eventType;
    persistenceEntity.publishedAt = domainEntity.publishedAt ?? null;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
