import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';
import { CacheConfig } from './config/cache-config.type';
import {
  CacheEvictOptions,
  CacheOptions,
  CacheResult,
  CacheScope,
  CacheStoredEntry,
} from './cache.types';
import { buildCacheKey } from './cache-key.helper';
import { CacheLogger } from './cache.logger';
import { CacheMetricsService } from './cache.metrics.service';
import { RedisCacheService } from './redis-cache.service';

@Injectable()
export class CacheService {
  private config: CacheConfig;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly redisCache: RedisCacheService,
    private readonly cacheLogger: CacheLogger,
    private readonly cacheMetrics: CacheMetricsService,
  ) {
    this.config = this.configService.get('cache', {
      infer: true,
    }) as CacheConfig;
  }

  isEnabled(): boolean {
    return this.config.enable && this.redisCache.isEnabled();
  }

  private getScopeDefaultTtlSeconds(scope: CacheScope): number {
    if (scope === 'user') {
      return this.config.defaultTtlSecondsUser ?? this.config.defaultTtlSeconds;
    }
    if (scope === 'admin') {
      return (
        this.config.defaultTtlSecondsAdmin ?? this.config.defaultTtlSeconds
      );
    }
    return this.config.defaultTtlSecondsGlobal ?? this.config.defaultTtlSeconds;
  }

  getDefaultOptions(): CacheOptions {
    return {
      ttlSeconds: this.getScopeDefaultTtlSeconds(this.config.defaultScope),
      refreshAfterSeconds: this.config.defaultRefreshAfterSeconds,
      scope: this.config.defaultScope,
      keyStrategy: this.config.defaultKeyStrategy,
      enabled: true,
    };
  }

  private resolveOptions(options: CacheOptions): CacheOptions {
    const merged: CacheOptions = {
      ...this.getDefaultOptions(),
      ...options,
    };
    if (options.autoKey && options.keyStrategy === undefined) {
      merged.keyStrategy = 'route';
    }
    if (options.ttl !== undefined && options.ttlSeconds === undefined) {
      merged.ttlSeconds = options.ttl;
    }
    if (
      options.refreshAfter !== undefined &&
      options.refreshAfterSeconds === undefined
    ) {
      merged.refreshAfterSeconds = options.refreshAfter;
    }
    if (options.ttl === undefined && options.ttlSeconds === undefined) {
      const scope = merged.scope ?? this.config.defaultScope;
      merged.ttlSeconds = this.getScopeDefaultTtlSeconds(scope);
    }
    return merged;
  }

  buildKey(options: CacheOptions, context?: any, args?: unknown[]): string {
    return buildCacheKey({
      prefix: this.config.keyPrefix,
      handlerName: context?.handlerName,
      className: context?.className,
      scope: options.scope ?? this.config.defaultScope,
      keyStrategy: options.keyStrategy ?? this.config.defaultKeyStrategy,
      key: options.key,
      args,
      context: context?.executionContext,
    });
  }

  async get<T>(key: string): Promise<CacheStoredEntry<T> | null> {
    return this.redisCache.get<T>(key);
  }

  async set<T>(
    key: string,
    value: T,
    ttlSeconds: number,
    refreshAfterSeconds?: number,
    tags: string[] = [],
  ) {
    if (!this.isEnabled()) {
      return;
    }
    const createdAt = Date.now();
    const refreshAt = refreshAfterSeconds
      ? createdAt + refreshAfterSeconds * 1000
      : undefined;
    const entry: CacheStoredEntry<T> = { value, createdAt, refreshAt };
    await this.redisCache.set(key, entry, ttlSeconds);
    await this.redisCache.setTags(key, tags);
    this.cacheMetrics.set();
    if (this.config.logHits) {
      this.cacheLogger.set(key, ttlSeconds);
    }
  }

  async wrap<T>(
    key: string,
    ttlSeconds: number,
    loader: () => Promise<T>,
  ): Promise<T> {
    if (!this.isEnabled()) {
      return loader();
    }
    const cachedEntry = await this.get<T>(key);
    if (cachedEntry) {
      if (this.config.logHits) {
        this.cacheLogger.hit(key, ttlSeconds);
      }
      this.cacheMetrics.hit();
      return cachedEntry.value;
    }

    if (this.config.logMisses) {
      this.cacheLogger.miss(key);
    }
    this.cacheMetrics.miss();

    try {
      return await this.redisCache.withLock(key, async () => {
        const existing = await this.get<T>(key);
        if (existing) {
          return existing.value;
        }
        const fresh = await loader();
        await this.set(key, fresh, ttlSeconds);
        return fresh;
      });
    } catch (error) {
      this.cacheMetrics.error();
      throw error;
    }
  }

  async cached<T>(
    options: CacheOptions,
    context: {
      executionContext?: any;
      className?: string;
      handlerName?: string;
    },
    args: unknown[],
    factory: () => Promise<T>,
  ): Promise<CacheResult<T>> {
    const merged = this.resolveOptions(options);
    if (!this.isEnabled() || merged.enabled === false) {
      const value = await factory();
      return { value, hit: false, refreshed: false, key: '' };
    }

    const key = this.buildKey(merged, context, args);
    const cachedEntry = await this.get<T>(key);
    if (cachedEntry) {
      const now = Date.now();
      if (cachedEntry.refreshAt && cachedEntry.refreshAt <= now) {
        if (this.config.logMisses) {
          this.cacheLogger.stale(key);
        }
        this.cacheMetrics.stale();
        void this.refreshInBackground({
          key,
          options: merged,
          factory,
        });
      } else if (this.config.logHits) {
        this.cacheLogger.hit(key, merged.ttlSeconds);
      }
      this.cacheMetrics.hit();
      return {
        value: cachedEntry.value,
        hit: true,
        refreshed: false,
        key,
      };
    }

    if (this.config.logMisses) {
      this.cacheLogger.miss(key);
    }
    this.cacheMetrics.miss();
    let value: T;
    try {
      value = await this.redisCache.withLock(key, async () => {
        const existing = await this.get<T>(key);
        if (existing) {
          return existing.value;
        }
        const fresh = await factory();
        await this.set(
          key,
          fresh,
          merged.ttlSeconds!,
          merged.refreshAfterSeconds,
          merged.tags,
        );
        return fresh;
      });
    } catch (error) {
      this.cacheMetrics.error();
      throw error;
    }

    return { value, hit: false, refreshed: true, key };
  }

  async evict(options: CacheEvictOptions): Promise<void> {
    if (!this.isEnabled()) {
      return;
    }
    const keys = options.keys ?? [];
    const patterns = options.patterns ?? [];
    const tags = options.tags ?? [];

    for (const key of keys) {
      await this.redisCache.del(key);
      this.cacheLogger.evict(key);
      this.cacheMetrics.evict();
    }

    for (const pattern of patterns) {
      await this.redisCache.delByPattern(pattern);
      this.cacheMetrics.evict();
    }

    if (tags.length) {
      await this.redisCache.evictTags(tags);
      tags.forEach(() => this.cacheMetrics.evict());
    }
  }

  private async refreshInBackground<T>(params: {
    key: string;
    options: CacheOptions;
    factory: () => Promise<T>;
  }) {
    const { key, options, factory } = params;
    try {
      await this.redisCache.withLock(key, async () => {
        const fresh = await factory();
        await this.set(
          key,
          fresh,
          options.ttlSeconds!,
          options.refreshAfterSeconds,
          options.tags,
        );
      });
      this.cacheMetrics.refresh();
    } catch (error) {
      this.cacheMetrics.error();
      this.cacheLogger.error('Cache refresh failed', error);
    }
  }
}
