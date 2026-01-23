import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, concatMap, from, lastValueFrom } from 'rxjs';
import {
  CACHE_DECORATOR_EVICT,
  CACHE_DECORATOR_OPTIONS,
} from './cache.constants';
import { CacheEvictOptions, CacheOptions } from './cache.types';
import { CacheService } from './cache.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly cacheService: CacheService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const classRef = context.getClass();
    const handlerOptions = this.reflector.get<CacheOptions>(
      CACHE_DECORATOR_OPTIONS,
      handler,
    );
    const classOptions = this.reflector.get<CacheOptions>(
      CACHE_DECORATOR_OPTIONS,
      classRef,
    );
    const handlerEvict = this.reflector.get<CacheEvictOptions>(
      CACHE_DECORATOR_EVICT,
      handler,
    );
    const classEvict = this.reflector.get<CacheEvictOptions>(
      CACHE_DECORATOR_EVICT,
      classRef,
    );

    const evictOptions = { ...(classEvict ?? {}), ...(handlerEvict ?? {}) };
    const hasEvict = Object.keys(evictOptions).length > 0;
    const hasCache = Boolean(handlerOptions || classOptions);

    const execute = async () => {
      if (evictOptions.beforeInvocation && hasEvict) {
        await this.cacheService.evict(evictOptions);
      }
      if (!hasCache) {
        return lastValueFrom(next.handle());
      }
      const merged = { ...(classOptions ?? {}), ...(handlerOptions ?? {}) };
      const ctxMeta = {
        executionContext: context,
        className: classRef?.name,
        handlerName: handler?.name,
      };
      const args = context.getArgs();
      const result = await this.cacheService.cached(
        merged,
        ctxMeta,
        args,
        async () => lastValueFrom(next.handle()),
      );
      return result.value;
    };

    const result$ = from(execute());
    if (hasEvict && !evictOptions.beforeInvocation) {
      return result$.pipe(
        concatMap(async (value) => {
          await this.cacheService.evict(evictOptions);
          return value;
        }),
      );
    }
    return result$;
  }
}
