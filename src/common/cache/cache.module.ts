import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from './cache.interceptor';
import { CacheLogger } from './cache.logger';
import { CacheMetricsController } from './cache.metrics.controller';
import { CacheMetricsService } from './cache.metrics.service';
import { CacheService } from './cache.service';
import { RedisCacheService } from './redis-cache.service';

@Global()
@Module({
  controllers: [CacheMetricsController],
  providers: [
    CacheLogger,
    CacheMetricsService,
    CacheService,
    RedisCacheService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [CacheService, RedisCacheService],
})
export class CacheModule {}
