# Cache Service Guide

## Overview

- Redis-backed cache with Redlock for horizontal scaling.
- Decorators for controller and service caching.
- Supports HTTP, gRPC, and Socket.IO (key strategy based on request or args).
- Optional Prometheus metrics endpoint for cache behavior.

## Decorators (controller layer)

```ts
import { UseCache, CacheEvict } from 'src/common/cache';

@UseCache({ ttl: 120, keyStrategy: 'request' })
@Controller('public')
export class PublicController {
  @Get('stats')
  @UseCache({ ttl: 30 }) // override per method
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

## Shortcut decorators

```ts
import { CacheUser, CacheGlobal, CacheAdmin, CacheBodyScoped } from 'src/common/cache';

@CacheGlobal() // global cache with default TTL + auto key
@Get('featured')
getFeatured() {
  return this.service.getFeatured();
}

@CacheUser(60) // per-user cache with TTL override
@Get('dashboard')
getDashboard() {
  return this.service.getDashboard();
}

@CacheAdmin() // shared across admins
@Get('reports')
getReports() {
  return this.service.getReports();
}

@CacheBodyScoped() // route + body-based key
@Post('search')
search(@Body() payload: SearchRequest) {
  return this.service.search(payload);
}
```

## Service usage

```ts
import { CacheableMethod, CacheEvictMethod, CacheService } from 'src/common/cache';

export class StatsService {
  constructor(public readonly cacheService: CacheService) {}

  @CacheableMethod({ ttl: 60, keyStrategy: 'args', tags: ['stats'] })
  async getStats(userId: string) {
    return this.repo.getStats(userId);
  }

  @CacheEvictMethod({ tags: ['stats'] })
  async refreshStats() {
    return this.repo.refreshStats();
  }
}
```

## CacheService.wrap helper

```ts
const key = `reports:summary:${accountId}`;
return this.cacheService.wrap(key, 120, async () => {
  return this.repo.loadSummary(accountId);
});
```

## Usage scenarios

### Global Data

```ts
@UseCache({ ttl: 180, scope: 'global', keyStrategy: 'request' })
@Get('products/featured')
getFeatured() {
  return this.service.getFeatured();
}
```

### Per-User Dashboard

```ts
@UseCache({ ttl: 60, scope: 'user', keyStrategy: 'request' })
@Get('dashboard')
getDashboard(@Request() req) {
  return this.service.getDashboard(req.user.id);
}
```

### Admin Reports (shared across all admins)

```ts
@UseCache({ ttl: 300, scope: 'admin', keyStrategy: 'request' })
@Get('reports')
getReports() {
  return this.service.getReports();
}
```

### Real-Time Socket Data

```ts
const result = await this.cacheService.cached(
  { ttl: 30, scope: 'global', keyStrategy: 'args', key: 'socket:price-ticker' },
  { className: 'TickerGateway', handlerName: 'handleTicker' },
  [payload],
  () => this.service.getTicker(payload),
);
```

### gRPC Client Caching

```ts
const result = await this.cacheService.cached(
  { ttl: 45, scope: 'global', keyStrategy: 'args', key: 'grpc:pricing' },
  { className: 'PricingGrpcHandler', handlerName: 'getPricing' },
  [request],
  () => this.client.getPricing(request),
);
```

## Key strategies

- `static`: one key for class+method (global).
- `request`: hashes HTTP request (method, route, params, query, body).
- `route`: hashes route path + request body.
- `args`: hashes method arguments (service caching, gRPC/Socket payloads).

## Scopes

- `global`: shared cache.
- `user`: key includes `request.user.id` (or `request.user.uid`) when available.
- `admin`: shared cache for admin routes (no per-user id).

## Key design patterns

Keys are built as `prefix:base:scope:strategy`. You can control `base` using the `key` option.

Examples (assuming `CACHE_KEY_PREFIX=cache`):

- `global:products:featured` -> `@UseCache({ key: 'products:featured', scope: 'global', keyStrategy: 'static' })`
- `user:{uid}:notifications` -> `@UseCache({ key: 'notifications', scope: 'user', keyStrategy: 'static' })`
- `route:{controller}:{method}:{hash(body)}` -> `@UseCache({ keyStrategy: 'request' })`
- `admin:reports` -> `@UseCache({ key: 'reports', scope: 'admin', keyStrategy: 'static' })`

## Auto refresh

Use `refreshAfterSeconds` to serve existing cache and refresh in background once stale.

## Metrics (Prometheus / RedisInsight)

- Prometheus: enable `CACHE_METRICS_ENABLE=true` and scrape `GET /metrics/cache`.
- Metric names use `CACHE_METRICS_PREFIX` (ex: `cache_hits_total`).
- RedisInsight: connect to `CACHE_REDIS_URL`, filter keys by `CACHE_KEY_PREFIX`, and inspect TTL/tag sets.

## Configuration (env)

```
CACHE_ENABLE=true
CACHE_REDIS_URL=redis://redis:6379/0
CACHE_KEY_PREFIX=cache
CACHE_DEFAULT_TTL_SECONDS=300
CACHE_DEFAULT_TTL_SECONDS_GLOBAL=300
CACHE_DEFAULT_TTL_SECONDS_USER=60
CACHE_DEFAULT_TTL_SECONDS_ADMIN=120
CACHE_DEFAULT_REFRESH_AFTER_SECONDS=0
CACHE_DEFAULT_SCOPE=global
CACHE_DEFAULT_KEY_STRATEGY=request
CACHE_LOCK_TTL_MS=5000
CACHE_LOCK_RETRY_COUNT=5
CACHE_LOCK_RETRY_DELAY_MS=200
CACHE_LOCK_RETRY_JITTER_MS=100
CACHE_LOG_HITS=true
CACHE_LOG_MISSES=true
CACHE_METRICS_ENABLE=false
CACHE_METRICS_PREFIX=cache
```

## Notes

- `ttl` is an alias for `ttlSeconds`.
- `refreshAfter` is an alias for `refreshAfterSeconds`.
- `autoKey: true` forces `keyStrategy: 'route'` unless you set a custom strategy.
- To include a user id when you are not in HTTP context, add it to `key` manually.
