import { CacheStoredEntry } from './cache.types';

type CacheSerializedEntry<T> = {
  value: T;
  createdAt: number;
  refreshAt?: number;
};

export function serializeCacheEntry<T>(entry: CacheStoredEntry<T>): string {
  return JSON.stringify(entry);
}

export function deserializeCacheEntry<T>(raw: string | null): CacheStoredEntry<T> | null {
  if (!raw) {
    return null;
  }
  return JSON.parse(raw) as CacheSerializedEntry<T>;
}
