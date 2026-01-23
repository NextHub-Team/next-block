import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InternalEventEntity as InternalEventOutboxEntity } from '../../internal-events/infrastructure/persistence/relational/entities/internal-event.entity';
import { EmitInternalEventDto } from './dto/emit-internal-event.dto';
import { INTERNAL_EVENTS_OPTIONS } from './types/internal-events-constants.type';
import { InternalEventsOptions } from './config/internal-events-config.type';
import { LoggerService } from '../logger/logger.service';
import { InternalEventMapper } from '../../internal-events/infrastructure/persistence/relational/mappers/internal-event.mapper';
import { InternalEvent } from '../../internal-events/domain/internal-event';

@Injectable()
export class InternalEventsService {
  constructor(
    @Inject(INTERNAL_EVENTS_OPTIONS)
    private readonly options: InternalEventsOptions,
    private readonly loggerService: LoggerService,
  ) {}

  async emit(
    manager: EntityManager,
    event: EmitInternalEventDto,
  ): Promise<InternalEvent> {
    if (!this.options.enable) {
      this.loggerService.warn(
        'Internal events are disabled; skipping emit.',
        InternalEventsService.name,
      );
      throw new Error('Internal events are disabled.');
    }
    const outbox = manager.create(InternalEventOutboxEntity, {
      eventType: event.eventType,
      payload: (event.payload ?? {}) as Record<string, unknown>,
    });
    const saved = await manager.save(InternalEventOutboxEntity, outbox);
    return InternalEventMapper.toDomain(saved);
  }
}
