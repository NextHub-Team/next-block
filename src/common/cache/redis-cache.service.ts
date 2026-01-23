import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import Redlock from 'redlock';
import { AllConfigType } from '../../config/config.type';
import { CacheConfig } from './config/cache-config.type';
import { CacheStoredEntry } from './cache.types';
import { deserializeCacheEntry, serializeCacheEntry } from './cache.serializer';
import { CacheLogger } from './cache.logger';

@Injectable()
export class RedisCacheService implements OnModuleInit, OnModuleDestroy {
  private client?: Redis;
  private redlock?: Redlock;
  private config: CacheConfig;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly cacheLogger: CacheLogger,
  ) {
    this.config = this.configService.get('cache', {
      infer: true,
    }) as CacheConfig;
  }

  onModuleInit() {
    if (!this.config.enable) {
      return;
    }
    this.client = new Redis(this.config.redisUrl, {
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
    });
    this.redlock = new Redlock([this.client], {
      retryCount: this.config.lockRetryCount,
      retryDelay: this.config.lockRetryDelayMs,
      retryJitter: this.config.lockRetryJitterMs,
    });
  }

  async onModuleDestroy() {
    await this.client?.quit();
  }

  isEnabled(): boolean {
    return this.config.enable;
  }

  getKeyPrefix(): string {
    return this.config.keyPrefix;
  }

  async ping(): Promise<boolean> {
    if (!this.client || !this.config.enable) {
      return false;
    }
    const response = await this.client.ping();
    return response === 'PONG';
  }

  async get<T>(key: string): Promise<CacheStoredEntry<T> | null> {
    if (!this.client || !this.config.enable) {
      return null;
    }
    const raw = await this.client.get(key);
    return deserializeCacheEntry<T>(raw);
  }

  async set<T>(key: string, value: CacheStoredEntry<T>, ttlSeconds: number) {
    if (!this.client || !this.config.enable) {
      return;
    }
    const payload = serializeCacheEntry(value);
    await this.client.set(key, payload, 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    if (!this.client || !this.config.enable) {
      return;
    }
    await this.client.del(key);
  }

  async delByPattern(pattern: string): Promise<void> {
    if (!this.client || !this.config.enable) {
      return;
    }
    const stream = this.client.scanStream({ match: pattern });
    const keys: string[] = [];
    for await (const chunk of stream) {
      keys.push(...chunk);
    }
    if (keys.length) {
      await this.client.del(...keys);
    }
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    if (!this.client || !this.config.enable) {
      return keys.map(() => null);
    }
    return this.client.mget(...keys);
  }

  async setTags(key: string, tags: string[]): Promise<void> {
    if (!this.client || !this.config.enable || tags.length === 0) {
      return;
    }
    const pipeline = this.client.pipeline();
    tags.forEach((tag) => {
      pipeline.sadd(this.tagKey(tag), key);
    });
    await pipeline.exec();
  }

  async evictTags(tags: string[]): Promise<void> {
    if (!this.client || !this.config.enable || tags.length === 0) {
      return;
    }
    const pipeline = this.client.pipeline();
    for (const tag of tags) {
      const tagKey = this.tagKey(tag);
      const keys = await this.client.smembers(tagKey);
      if (keys.length) {
        pipeline.del(...keys);
      }
      pipeline.del(tagKey);
    }
    await pipeline.exec();
  }

  async withLock<T>(key: string, work: () => Promise<T>): Promise<T> {
    if (!this.redlock) {
      return work();
    }
    const lockKey = `${key}:lock`;
    const lock = await this.redlock.acquire([lockKey], this.config.lockTtlMs);
    try {
      return await work();
    } finally {
      await lock.release().catch((err) => {
        this.cacheLogger.error('Failed to release cache lock', err);
      });
    }
  }

  private tagKey(tag: string): string {
    return `${this.config.keyPrefix}:tag:${tag}`;
  }
}
