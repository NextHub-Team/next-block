export type CacheScope = 'global' | 'user' | 'admin';
export type CacheKeyStrategy = 'static' | 'request' | 'args' | 'route';

export type CacheOptions = {
  ttlSeconds?: number;
  ttl?: number;
  refreshAfterSeconds?: number;
  refreshAfter?: number;
  scope?: CacheScope;
  keyStrategy?: CacheKeyStrategy;
  autoKey?: boolean;
  key?: string;
  tags?: string[];
  enabled?: boolean;
};

export type CacheEvictOptions = {
  keys?: string[];
  patterns?: string[];
  tags?: string[];
  beforeInvocation?: boolean;
};

export type CacheResult<T> = {
  value: T;
  hit: boolean;
  refreshed: boolean;
  key: string;
};

export type CacheStoredEntry<T> = {
  value: T;
  createdAt: number;
  refreshAt?: number;
};
