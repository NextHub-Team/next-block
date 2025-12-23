import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { INTERNAL_EVENTS_OPTIONS } from './types/internal-events.constants';
import { InternalEventsOptions } from './config/internal-events-config.type';
import {
  INTERNAL_EVENTS_DEFAULT_REDIS_RETRY_MAX_MS,
  INTERNAL_EVENTS_DEFAULT_REDIS_RETRY_STEP_MS,
  INTERNAL_EVENTS_DEFAULT_REDIS_URL,
} from './types/internal-events-const.type';
import { LoggerService } from '../logger/logger.service';
import { AllConfigType } from '../../config/config.type';
import { ConfigGet } from '../../config/config.decorator';

@Injectable()
export class InternalEventsRedisService implements OnModuleDestroy {
  private readonly client: Redis;
  private readonly redisUrl: string;
  private lastErrorMessage = '';
  private lastErrorAt = 0;
  private suppressedErrors = 0;
  private lastReconnectLogAt = 0;

  @ConfigGet('internalEvents.redisUrl', {
    inferEnvVar: true,
    defaultValue: INTERNAL_EVENTS_DEFAULT_REDIS_URL,
  })
  private readonly redisUrlConfig!: string;

  @ConfigGet('internalEvents.redisRetryStepMs', {
    inferEnvVar: true,
    defaultValue: INTERNAL_EVENTS_DEFAULT_REDIS_RETRY_STEP_MS,
  })
  private readonly redisRetryStepMsConfig!: number;

  @ConfigGet('internalEvents.redisRetryMaxMs', {
    inferEnvVar: true,
    defaultValue: INTERNAL_EVENTS_DEFAULT_REDIS_RETRY_MAX_MS,
  })
  private readonly redisRetryMaxMsConfig!: number;

  constructor(
    @Inject(INTERNAL_EVENTS_OPTIONS)
    private readonly options: InternalEventsOptions,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {
    // Touch configService so ConfigGet decorator can access it without lint warnings.
    void this.configService;

    const redisUrlFromConfig = this.redisUrlConfig;
    this.redisUrl =
      redisUrlFromConfig ??
      options.redisUrl ??
      INTERNAL_EVENTS_DEFAULT_REDIS_URL;
    this.loggerService.log(
      `Connecting to internal events Redis at ${this.redisUrl}`,
      InternalEventsRedisService.name,
    );
    const retryStepMs =
      this.redisRetryStepMsConfig ??
      this.options.redisRetryStepMs ??
      INTERNAL_EVENTS_DEFAULT_REDIS_RETRY_STEP_MS;
    const retryMaxMs =
      this.redisRetryMaxMsConfig ??
      this.options.redisRetryMaxMs ??
      INTERNAL_EVENTS_DEFAULT_REDIS_RETRY_MAX_MS;
    this.loggerService.debug(
      `Internal events Redis retry configured step=${retryStepMs}ms max=${retryMaxMs}ms`,
      InternalEventsRedisService.name,
    );
    this.client = new Redis(this.redisUrl, {
      // Delay connection until listeners are attached to avoid unhandled errors
      lazyConnect: true,
      // Keep retry attempts but avoid noisy max-retry errors; we handle errors manually
      maxRetriesPerRequest: null,
      // Reconnect cadence driven by env-configured step/max (capped by max)
      retryStrategy: (times) => {
        const stepMs = Math.max(retryStepMs, 1_000);
        const maxMs = Math.max(retryMaxMs, stepMs);
        return Math.min(times * stepMs, maxMs);
      },
    });
    this.client.on('ready', () => {
      this.loggerService.log(
        `Internal events Redis client ready (url=${this.redisUrl})`,
        InternalEventsRedisService.name,
      );
    });
    this.client.on('error', (err) => {
      const now = Date.now();
      const message = err?.message ?? 'Redis error';
      const sameAsLast = message === this.lastErrorMessage;
      const withinWindow = now - this.lastErrorAt < 30_000;
      if (sameAsLast && withinWindow) {
        this.suppressedErrors += 1;
        return;
      }
      if (this.suppressedErrors > 0) {
        this.loggerService.warn(
          `Internal events Redis error repeated ${this.suppressedErrors} times (suppressed).`,
          InternalEventsRedisService.name,
        );
        this.suppressedErrors = 0;
      }
      this.lastErrorMessage = message;
      this.lastErrorAt = now;
      this.loggerService.error(
        `Internal events Redis error: ${this.formatFriendlyError(err)}`,
        undefined,
        InternalEventsRedisService.name,
      );
    });
    this.client.on('end', () => {
      this.loggerService.warn(
        'Internal events Redis connection closed',
        InternalEventsRedisService.name,
      );
    });
    this.client.on('reconnecting', (delay) => {
      const now = Date.now();
      if (now - this.lastReconnectLogAt >= 60_000) {
        this.lastReconnectLogAt = now;
        this.loggerService.debug(
          `Internal events Redis reconnecting in ${delay}ms`,
          InternalEventsRedisService.name,
        );
      }
    });
    // Initiate the connection after listeners are in place
    void this.client.connect().catch((err) => {
      this.loggerService.error(
        `Internal events Redis initial connect failed: ${this.formatFriendlyError(err)}`,
        undefined,
        InternalEventsRedisService.name,
      );
    }).then(() => {
      this.loggerService.log(
        `Internal events Redis initial connection established (url=${this.redisUrl})`,
        InternalEventsRedisService.name,
      );
    });
    this.loggerService.debug(
      'Internal events Redis client initialized',
      InternalEventsRedisService.name,
    );
  }

  getClient(): Redis {
    return this.client;
  }

  private formatFriendlyError(err: Error | undefined): string {
    if (!err) {
      return 'Unknown Redis error';
    }
    const code = (err as any)?.code as string | undefined;
    const hostname = this.safeRedisHost();

    if (code === 'ENOTFOUND') {
      return `Redis host could not be resolved (host=${hostname ?? 'unknown'}, url=${this.redisUrl}). Check INTERNAL_EVENTS_REDIS_URL.`;
    }
    if (code === 'ECONNREFUSED') {
      return `Redis refused the connection (host=${hostname ?? 'unknown'}, url=${this.redisUrl}). Ensure Redis is reachable.`;
    }

    const base = err.message ?? 'Unknown Redis error';
    return code ? `${base} (code=${code})` : base;
  }

  private safeRedisHost(): string | undefined {
    try {
      return new URL(this.redisUrl).hostname;
    } catch (e) {
      return undefined;
    }
  }

  async onModuleDestroy() {
    this.loggerService.debug(
      'Closing internal events Redis client',
      InternalEventsRedisService.name,
    );
    await this.client.quit();
  }
}
