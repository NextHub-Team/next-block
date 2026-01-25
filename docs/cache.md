# Cache Service Guide

## Overview
- Redis-backed cache with Redlock for horizontal scaling.
- Decorators for controller and service caching.
- Supports HTTP, gRPC, and Socket.IO (key strategy based on request or args).

## Controller usage (HTTP/gRPC/Socket)
```ts
import { Cacheable, CacheEvict } from 'src/common/cache/cache.decorators';

@Cacheable({ ttlSeconds: 120, keyStrategy: 'request' })
@Controller('public')
export class PublicController {
  @Get('stats')
  @Cacheable({ ttlSeconds: 30 }) // override per method
  getStats() {
    return this.service.getStats();
  }

  @Post('refresh')
  @CacheEvict({ tags: ['stats'], beforeInvocation: true })
  refreshStats() {
    return this.service.refreshStats();
  }
}
```

## Service usage
```ts
import { CacheableMethod, CacheEvictMethod } from 'src/common/cache/cache.service.decorators';

export class StatsService {
  constructor(public readonly cacheService: CacheService) {}

  @CacheableMethod({ ttlSeconds: 60, keyStrategy: 'args', tags: ['stats'] })
  async getStats(userId: string) {
    return this.repo.getStats(userId);
  }

  @CacheEvictMethod({ tags: ['stats'] })
  async refreshStats() {
    return this.repo.refreshStats();
  }
}
```

## Key strategies
- `static`: one key for class+method (global).
- `request`: hashes HTTP request (method, path, params, query, body).
- `args`: hashes method arguments (service caching, gRPC/Socket payloads).

## Scopes
- `global`: shared cache.
- `user`: key includes `request.user.id` when available.

## Auto refresh
Use `refreshAfterSeconds` to serve existing cache and refresh in background once stale.

## Configuration (env)
```
CACHE_ENABLE=true
CACHE_REDIS_URL=redis://redis:6379/0
CACHE_KEY_PREFIX=cache
CACHE_DEFAULT_TTL_SECONDS=300
CACHE_DEFAULT_REFRESH_AFTER_SECONDS=0
CACHE_DEFAULT_SCOPE=global
CACHE_DEFAULT_KEY_STRATEGY=request
CACHE_LOCK_TTL_MS=5000
CACHE_LOCK_RETRY_COUNT=5
CACHE_LOCK_RETRY_DELAY_MS=200
CACHE_LOCK_RETRY_JITTER_MS=100
CACHE_LOG_HITS=true
CACHE_LOG_MISSES=true
```
