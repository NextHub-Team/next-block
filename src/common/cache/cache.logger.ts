import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { LoggerType } from '../logger/types/logger-enum.type';

@Injectable()
export class CacheLogger {
  constructor(private readonly logger: LoggerService) {}

  hit(key: string, ttlSeconds?: number) {
    this.logger.log(
      { event: 'cache_hit', key, ttlSeconds },
      LoggerType.HTTP,
    );
  }

  miss(key: string) {
    this.logger.log({ event: 'cache_miss', key }, LoggerType.HTTP);
  }

  stale(key: string) {
    this.logger.log({ event: 'cache_stale', key }, LoggerType.HTTP);
  }

  set(key: string, ttlSeconds?: number) {
    this.logger.log(
      { event: 'cache_set', key, ttlSeconds },
      LoggerType.HTTP,
    );
  }

  evict(key: string) {
    this.logger.warn({ event: 'cache_evict', key }, LoggerType.HTTP);
  }

  error(message: string, error: unknown) {
    this.logger.error({ event: 'cache_error', message, error }, undefined, 'Cache');
  }
}
