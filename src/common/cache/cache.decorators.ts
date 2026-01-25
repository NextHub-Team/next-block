import { applyDecorators, SetMetadata } from '@nestjs/common';
import { CacheEvictOptions, CacheOptions } from './cache.types';
import {
  CACHE_DECORATOR_EVICT,
  CACHE_DECORATOR_OPTIONS,
} from './cache.constants';

export const Cacheable = (options: CacheOptions = {}) =>
  applyDecorators(SetMetadata(CACHE_DECORATOR_OPTIONS, options));

export const UseCache = Cacheable;

export const CacheEvict = (options: CacheEvictOptions = {}) =>
  applyDecorators(SetMetadata(CACHE_DECORATOR_EVICT, options));

const withTtl = (ttlSeconds?: number): CacheOptions =>
  ttlSeconds === undefined ? {} : { ttlSeconds };

export const CacheUser = (ttlSeconds?: number) =>
  Cacheable({
    scope: 'user',
    autoKey: true,
    ...withTtl(ttlSeconds),
  });

export const CacheGlobal = (ttlSeconds?: number) =>
  Cacheable({
    scope: 'global',
    autoKey: true,
    ...withTtl(ttlSeconds),
  });

export const CacheAdmin = (ttlSeconds?: number) =>
  Cacheable({
    scope: 'admin',
    autoKey: true,
    ...withTtl(ttlSeconds),
  });

export const CacheBodyScoped = (ttlSeconds?: number) =>
  Cacheable({
    autoKey: true,
    ...withTtl(ttlSeconds),
  });
