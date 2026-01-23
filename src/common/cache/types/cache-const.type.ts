export const CACHE_ENABLE = true;
export const CACHE_DEFAULT_TTL_SECONDS = 300;
export const CACHE_DEFAULT_REFRESH_AFTER_SECONDS = 0;
export const CACHE_DEFAULT_SCOPE = 'global';
export const CACHE_DEFAULT_KEY_STRATEGY = 'static';
export const CACHE_KEY_PREFIX = 'cache';
export const CACHE_REDIS_URL =
  process.env.REDIS_CACHE_URL ?? 'redis://localhost:6379/0';
export const CACHE_LOCK_TTL_MS = 5000;
export const CACHE_LOCK_RETRY_COUNT = 5;
export const CACHE_LOCK_RETRY_DELAY_MS = 200;
export const CACHE_LOCK_RETRY_JITTER_MS = 100;
export const CACHE_LOG_HITS = true;
export const CACHE_LOG_MISSES = true;
