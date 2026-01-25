import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { createToggleableConfig } from '../../../config/config.helper';
import { CacheConfig } from './cache-config.type';
import {
  CACHE_DEFAULT_KEY_STRATEGY,
  CACHE_DEFAULT_REFRESH_AFTER_SECONDS,
  CACHE_DEFAULT_SCOPE,
  CACHE_DEFAULT_TTL_SECONDS,
  CACHE_DEFAULT_TTL_SECONDS_ADMIN,
  CACHE_DEFAULT_TTL_SECONDS_GLOBAL,
  CACHE_DEFAULT_TTL_SECONDS_USER,
  CACHE_ENABLE,
  CACHE_KEY_PREFIX,
  CACHE_LOCK_RETRY_COUNT,
  CACHE_LOCK_RETRY_DELAY_MS,
  CACHE_LOCK_RETRY_JITTER_MS,
  CACHE_LOCK_TTL_MS,
  CACHE_LOG_HITS,
  CACHE_LOG_MISSES,
  CACHE_METRICS_ENABLE,
  CACHE_METRICS_PREFIX,
  CACHE_REDIS_URL,
} from '../types/cache-const.type';
import { CacheKeyStrategy, CacheScope } from '../cache.types';
import {
  booleanValidator,
  numberValidator,
} from '../../../utils/helpers/env.helper';

class CacheEnvValidator {
  @IsBoolean()
  CACHE_ENABLE: boolean;

  @IsString()
  CACHE_REDIS_URL: string;

  @IsString()
  CACHE_KEY_PREFIX: string;

  @IsNumber()
  CACHE_DEFAULT_TTL_SECONDS: number;

  @IsOptional()
  @IsNumber()
  CACHE_DEFAULT_TTL_SECONDS_GLOBAL?: number;

  @IsOptional()
  @IsNumber()
  CACHE_DEFAULT_TTL_SECONDS_USER?: number;

  @IsOptional()
  @IsNumber()
  CACHE_DEFAULT_TTL_SECONDS_ADMIN?: number;

  @IsNumber()
  CACHE_DEFAULT_REFRESH_AFTER_SECONDS: number;

  @IsIn(['global', 'user', 'admin'])
  CACHE_DEFAULT_SCOPE: CacheScope;

  @IsIn(['static', 'request', 'args', 'route'])
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

  @IsBoolean()
  CACHE_METRICS_ENABLE: boolean;

  @IsString()
  CACHE_METRICS_PREFIX: string;
}

export default createToggleableConfig<CacheConfig, CacheEnvValidator>(
  'cache',
  CacheEnvValidator,
  {
    enable: CACHE_ENABLE,
    redisUrl: CACHE_REDIS_URL,
    keyPrefix: CACHE_KEY_PREFIX,
    defaultTtlSeconds: CACHE_DEFAULT_TTL_SECONDS,
    defaultTtlSecondsGlobal: CACHE_DEFAULT_TTL_SECONDS_GLOBAL,
    defaultTtlSecondsUser: CACHE_DEFAULT_TTL_SECONDS_USER,
    defaultTtlSecondsAdmin: CACHE_DEFAULT_TTL_SECONDS_ADMIN,
    defaultRefreshAfterSeconds: CACHE_DEFAULT_REFRESH_AFTER_SECONDS,
    defaultScope: CACHE_DEFAULT_SCOPE as CacheScope,
    defaultKeyStrategy: CACHE_DEFAULT_KEY_STRATEGY as CacheKeyStrategy,
    lockTtlMs: CACHE_LOCK_TTL_MS,
    lockRetryCount: CACHE_LOCK_RETRY_COUNT,
    lockRetryDelayMs: CACHE_LOCK_RETRY_DELAY_MS,
    lockRetryJitterMs: CACHE_LOCK_RETRY_JITTER_MS,
    logHits: CACHE_LOG_HITS,
    logMisses: CACHE_LOG_MISSES,
    metricsEnable: CACHE_METRICS_ENABLE,
    metricsPrefix: CACHE_METRICS_PREFIX,
  },
  {
    enableKey: 'enable',
    enableEnvKey: 'CACHE_ENABLE',
    mapEnabledConfig: (env) => ({
      redisUrl: env.CACHE_REDIS_URL ?? CACHE_REDIS_URL,
      keyPrefix: env.CACHE_KEY_PREFIX ?? CACHE_KEY_PREFIX,
      defaultTtlSeconds: numberValidator(
        env.CACHE_DEFAULT_TTL_SECONDS,
        CACHE_DEFAULT_TTL_SECONDS,
      ),
      defaultTtlSecondsGlobal: numberValidator(
        env.CACHE_DEFAULT_TTL_SECONDS_GLOBAL,
        CACHE_DEFAULT_TTL_SECONDS_GLOBAL,
      ),
      defaultTtlSecondsUser: numberValidator(
        env.CACHE_DEFAULT_TTL_SECONDS_USER,
        CACHE_DEFAULT_TTL_SECONDS_USER,
      ),
      defaultTtlSecondsAdmin: numberValidator(
        env.CACHE_DEFAULT_TTL_SECONDS_ADMIN,
        CACHE_DEFAULT_TTL_SECONDS_ADMIN,
      ),
      defaultRefreshAfterSeconds: numberValidator(
        env.CACHE_DEFAULT_REFRESH_AFTER_SECONDS,
        CACHE_DEFAULT_REFRESH_AFTER_SECONDS,
      ),
      defaultScope: env.CACHE_DEFAULT_SCOPE ?? CACHE_DEFAULT_SCOPE,
      defaultKeyStrategy:
        env.CACHE_DEFAULT_KEY_STRATEGY ?? CACHE_DEFAULT_KEY_STRATEGY,
      lockTtlMs: numberValidator(env.CACHE_LOCK_TTL_MS, CACHE_LOCK_TTL_MS),
      lockRetryCount: numberValidator(
        env.CACHE_LOCK_RETRY_COUNT,
        CACHE_LOCK_RETRY_COUNT,
      ),
      lockRetryDelayMs: numberValidator(
        env.CACHE_LOCK_RETRY_DELAY_MS,
        CACHE_LOCK_RETRY_DELAY_MS,
      ),
      lockRetryJitterMs: numberValidator(
        env.CACHE_LOCK_RETRY_JITTER_MS,
        CACHE_LOCK_RETRY_JITTER_MS,
      ),
      logHits: booleanValidator(env.CACHE_LOG_HITS, CACHE_LOG_HITS),
      logMisses: booleanValidator(env.CACHE_LOG_MISSES, CACHE_LOG_MISSES),
      metricsEnable: booleanValidator(
        env.CACHE_METRICS_ENABLE,
        CACHE_METRICS_ENABLE,
      ),
      metricsPrefix: env.CACHE_METRICS_PREFIX ?? CACHE_METRICS_PREFIX,
    }),
    mapDisabledConfig: () => ({
      logHits: false,
      logMisses: false,
      metricsEnable: false,
    }),
  },
);
