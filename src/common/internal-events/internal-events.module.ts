import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscoveryModule } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InternalEventEntity as InternalEventOutboxEntity } from '../../internal-events/infrastructure/persistence/relational/entities/internal-event.entity';
import { InternalEventsService } from './internal-events.service';
import { InternalEventsDispatcher } from './helper/internal-events.dispatcher';
import { InternalEventsConsumer } from './internal-events.consumer';
import { InternalEventsRegistry } from './internal-events.registry';
import { INTERNAL_EVENTS_OPTIONS } from './types/internal-events.constants';
import { InternalEventsRedisService } from './internal-events.redis.service';
import { AllConfigType } from '../../config/config.type';
import {
  InternalEventsConfig,
  buildInternalEventsOptions,
  InternalEventsOptions,
} from './config/internal-events-config.type';
import {
  buildInternalEventsOptionsFromConfig,
} from './config/internal-events.config';

@Global()
@Module({})
export class InternalEventsModule {
  private static buildProviders(optionsProvider: Provider) {
    return [
      optionsProvider,
      InternalEventsRedisService,
      InternalEventsRegistry,
      InternalEventsService,
      InternalEventsDispatcher,
      InternalEventsConsumer,
    ];
  }

  static forRoot(options: Partial<InternalEventsOptions> = {}): DynamicModule {
    const internalEventsOptions =
      buildInternalEventsOptionsFromConfig(options);

    const providers = this.buildProviders({
      provide: INTERNAL_EVENTS_OPTIONS,
      useValue: internalEventsOptions,
    });

    return {
      module: InternalEventsModule,
      imports: [
        DiscoveryModule,
        ConfigModule,
        TypeOrmModule.forFeature([InternalEventOutboxEntity]),
      ],
      providers,
      exports: [InternalEventsService],
    };
  }

  static forRootAsync(): DynamicModule {
    const providers = this.buildProviders({
      provide: INTERNAL_EVENTS_OPTIONS,
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<AllConfigType>,
      ): InternalEventsOptions => {
        const config = configService.get<InternalEventsConfig>(
          'internalEvents',
          {
            infer: true,
          },
        );
        return buildInternalEventsOptions(config ?? {});
      },
    });

    return {
      module: InternalEventsModule,
      imports: [
        DiscoveryModule,
        ConfigModule,
        TypeOrmModule.forFeature([InternalEventOutboxEntity]),
      ],
      providers,
      exports: [InternalEventsService],
    };
  }
}
