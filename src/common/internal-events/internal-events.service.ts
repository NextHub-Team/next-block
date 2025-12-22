import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InternalEventOutboxEntity } from './entities/internal-event-outbox.entity';
import { InternalEventToEmit } from './internal-events.types';

@Injectable()
export class InternalEventsService {
  async emit<TPayload>(
    manager: EntityManager,
    event: InternalEventToEmit<TPayload>,
  ): Promise<InternalEventOutboxEntity> {
    const outbox = manager.create(InternalEventOutboxEntity, {
      eventType: event.eventType,
      payload: event.payload as Record<string, unknown>,
    });
    return manager.save(InternalEventOutboxEntity, outbox);
  }
}
