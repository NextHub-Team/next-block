import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscoveryModule } from '@nestjs/core';
import { InternalEventOutboxEntity } from './entities/internal-event-outbox.entity';
import { InternalEventsService } from './internal-events.service';
import { InternalEventsDispatcher } from './internal-events.dispatcher';
import { InternalEventsConsumer } from './internal-events.consumer';
import { InternalEventsRegistry } from './internal-events.registry';
import {
  buildInternalEventsOptions,
  InternalEventsModuleOptions,
} from './internal-events.types';
import { INTERNAL_EVENTS_OPTIONS } from './internal-events.constants';
import { InternalEventsRedisService } from './internal-events.redis.service';

@Global()
@Module({})
export class InternalEventsModule {
  static forRoot(
    options: Partial<InternalEventsModuleOptions> = {},
  ): DynamicModule {
    const internalEventsOptions = buildInternalEventsOptions(options);

    return {
      module: InternalEventsModule,
      imports: [DiscoveryModule, TypeOrmModule.forFeature([InternalEventOutboxEntity])],
      providers: [
        {
          provide: INTERNAL_EVENTS_OPTIONS,
          useValue: internalEventsOptions,
        },
        InternalEventsRedisService,
        InternalEventsRegistry,
        InternalEventsService,
        InternalEventsDispatcher,
        InternalEventsConsumer,
      ],
      exports: [InternalEventsService],
    };
  }
}
