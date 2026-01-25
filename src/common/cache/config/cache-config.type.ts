import { CacheKeyStrategy, CacheScope } from '../cache.types';

export type CacheConfig = {
  enable: boolean;
  redisUrl: string;
  keyPrefix: string;
  defaultTtlSeconds: number;
  defaultTtlSecondsGlobal: number;
  defaultTtlSecondsUser: number;
  defaultTtlSecondsAdmin: number;
  defaultRefreshAfterSeconds: number;
  defaultScope: CacheScope;
  defaultKeyStrategy: CacheKeyStrategy;
  lockTtlMs: number;
  lockRetryCount: number;
  lockRetryDelayMs: number;
  lockRetryJitterMs: number;
  logHits: boolean;
  logMisses: boolean;
  metricsEnable: boolean;
  metricsPrefix: string;
};
