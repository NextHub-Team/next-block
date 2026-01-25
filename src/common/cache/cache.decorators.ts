import { applyDecorators, SetMetadata } from '@nestjs/common';
import { CacheEvictOptions, CacheOptions } from './cache.types';
import {
  CACHE_DECORATOR_EVICT,
  CACHE_DECORATOR_OPTIONS,
} from './cache.constants';

export const Cacheable = (options: CacheOptions = {}) =>
  applyDecorators(SetMetadata(CACHE_DECORATOR_OPTIONS, options));

export const CacheEvict = (options: CacheEvictOptions = {}) =>
  applyDecorators(SetMetadata(CACHE_DECORATOR_EVICT, options));
