export type CacheScope = 'global' | 'user';
export type CacheKeyStrategy = 'static' | 'request' | 'args';

export type CacheOptions = {
  ttlSeconds?: number;
  refreshAfterSeconds?: number;
  scope?: CacheScope;
  keyStrategy?: CacheKeyStrategy;
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
