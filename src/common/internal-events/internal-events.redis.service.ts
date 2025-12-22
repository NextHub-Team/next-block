import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { INTERNAL_EVENTS_OPTIONS } from './internal-events.constants';
import { InternalEventsModuleOptions } from './internal-events.types';

@Injectable()
export class InternalEventsRedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor(
    @Inject(INTERNAL_EVENTS_OPTIONS)
    private readonly options: InternalEventsModuleOptions,
  ) {
    const redisUrl = options.redisUrl ?? 'redis://localhost:6379';
    this.client = new Redis(redisUrl);
  }

  getClient(): Redis {
    return this.client;
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
