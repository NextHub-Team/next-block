import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsString,
} from 'class-validator';
import { createToggleableConfig } from '../../../config/config.helper';
import { CacheConfig } from './cache-config.type';
import {
  CACHE_DEFAULT_KEY_STRATEGY,
  CACHE_DEFAULT_REFRESH_AFTER_SECONDS,
  CACHE_DEFAULT_SCOPE,
  CACHE_DEFAULT_TTL_SECONDS,
  CACHE_ENABLE,
  CACHE_KEY_PREFIX,
  CACHE_LOCK_RETRY_COUNT,
  CACHE_LOCK_RETRY_DELAY_MS,
  CACHE_LOCK_RETRY_JITTER_MS,
  CACHE_LOCK_TTL_MS,
  CACHE_LOG_HITS,
  CACHE_LOG_MISSES,
  CACHE_REDIS_URL,
} from '../types/cache-const.type';
import { CacheKeyStrategy, CacheScope } from '../cache.types';

class CacheEnvValidator {
  @IsBoolean()
  CACHE_ENABLE: boolean;

  @IsString()
  CACHE_REDIS_URL: string;

  @IsString()
  CACHE_KEY_PREFIX: string;

  @IsNumber()
  CACHE_DEFAULT_TTL_SECONDS: number;

  @IsNumber()
  CACHE_DEFAULT_REFRESH_AFTER_SECONDS: number;

  @IsIn(['global', 'user'])
  CACHE_DEFAULT_SCOPE: CacheScope;

  @IsIn(['static', 'request', 'args'])
  CACHE_DEFAULT_KEY_STRATEGY: CacheKeyStrategy;

  @IsNumber()
  CACHE_LOCK_TTL_MS: number;

  @IsNumber()
  CACHE_LOCK_RETRY_COUNT: number;

  @IsNumber()
  CACHE_LOCK_RETRY_DELAY_MS: number;

  @IsNumber()
  CACHE_LOCK_RETRY_JITTER_MS: number;

  @IsBoolean()
  CACHE_LOG_HITS: boolean;

  @IsBoolean()
  CACHE_LOG_MISSES: boolean;
}

const defaults: CacheConfig = {
  enable: CACHE_ENABLE,
  redisUrl: CACHE_REDIS_URL,
  keyPrefix: CACHE_KEY_PREFIX,
  defaultTtlSeconds: CACHE_DEFAULT_TTL_SECONDS,
  defaultRefreshAfterSeconds: CACHE_DEFAULT_REFRESH_AFTER_SECONDS,
  defaultScope: CACHE_DEFAULT_SCOPE as CacheScope,
  defaultKeyStrategy: CACHE_DEFAULT_KEY_STRATEGY as CacheKeyStrategy,
  lockTtlMs: CACHE_LOCK_TTL_MS,
  lockRetryCount: CACHE_LOCK_RETRY_COUNT,
  lockRetryDelayMs: CACHE_LOCK_RETRY_DELAY_MS,
  lockRetryJitterMs: CACHE_LOCK_RETRY_JITTER_MS,
  logHits: CACHE_LOG_HITS,
  logMisses: CACHE_LOG_MISSES,
};

export default createToggleableConfig<CacheConfig, CacheEnvValidator>(
  'cache',
  CacheEnvValidator,
  defaults,
  {
    enableKey: 'enable',
    enableEnvKey: 'CACHE_ENABLE',
    mapEnabledConfig: (env) => ({
      redisUrl: env.CACHE_REDIS_URL ?? defaults.redisUrl,
      keyPrefix: env.CACHE_KEY_PREFIX ?? defaults.keyPrefix,
      defaultTtlSeconds:
        env.CACHE_DEFAULT_TTL_SECONDS ?? defaults.defaultTtlSeconds,
      defaultRefreshAfterSeconds:
        env.CACHE_DEFAULT_REFRESH_AFTER_SECONDS ??
        defaults.defaultRefreshAfterSeconds,
      defaultScope: env.CACHE_DEFAULT_SCOPE ?? defaults.defaultScope,
      defaultKeyStrategy:
        env.CACHE_DEFAULT_KEY_STRATEGY ?? defaults.defaultKeyStrategy,
      lockTtlMs: env.CACHE_LOCK_TTL_MS ?? defaults.lockTtlMs,
      lockRetryCount: env.CACHE_LOCK_RETRY_COUNT ?? defaults.lockRetryCount,
      lockRetryDelayMs: env.CACHE_LOCK_RETRY_DELAY_MS ?? defaults.lockRetryDelayMs,
      lockRetryJitterMs:
        env.CACHE_LOCK_RETRY_JITTER_MS ?? defaults.lockRetryJitterMs,
      logHits: env.CACHE_LOG_HITS ?? defaults.logHits,
      logMisses: env.CACHE_LOG_MISSES ?? defaults.logMisses,
    }),
    mapDisabledConfig: () => ({
      logHits: false,
      logMisses: false,
    }),
  },
);
