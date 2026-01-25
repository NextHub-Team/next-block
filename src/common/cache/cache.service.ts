import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';
import { CacheConfig } from './config/cache-config.type';
import {
  CacheEvictOptions,
  CacheOptions,
  CacheResult,
  CacheStoredEntry,
} from './cache.types';
import { buildCacheKey } from './cache-key.helper';
import { CacheLogger } from './cache.logger';
import { RedisCacheService } from './redis-cache.service';

@Injectable()
export class CacheService {
  private config: CacheConfig;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly redisCache: RedisCacheService,
    private readonly cacheLogger: CacheLogger,
  ) {
    this.config = this.configService.get('cache', {
      infer: true,
    }) as CacheConfig;
  }

  isEnabled(): boolean {
    return this.config.enable && this.redisCache.isEnabled();
  }

  getDefaultOptions(): CacheOptions {
    return {
      ttlSeconds: this.config.defaultTtlSeconds,
      refreshAfterSeconds: this.config.defaultRefreshAfterSeconds,
      scope: this.config.defaultScope,
      keyStrategy: this.config.defaultKeyStrategy,
      enabled: true,
    };
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
    const createdAt = Date.now();
    const refreshAt = refreshAfterSeconds
      ? createdAt + refreshAfterSeconds * 1000
      : undefined;
    const entry: CacheStoredEntry<T> = { value, createdAt, refreshAt };
    await this.redisCache.set(key, entry, ttlSeconds);
    await this.redisCache.setTags(key, tags);
    if (this.config.logHits) {
      this.cacheLogger.set(key, ttlSeconds);
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
    const merged = { ...this.getDefaultOptions(), ...options };
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
        void this.refreshInBackground({
          key,
          options: merged,
          factory,
        });
      } else if (this.config.logHits) {
        this.cacheLogger.hit(key, merged.ttlSeconds);
      }
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
    const value = await this.redisCache.withLock(key, async () => {
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
    }

    for (const pattern of patterns) {
      await this.redisCache.delByPattern(pattern);
    }

    if (tags.length) {
      await this.redisCache.evictTags(tags);
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
    } catch (error) {
      this.cacheLogger.error('Cache refresh failed', error);
    }
  }
}
