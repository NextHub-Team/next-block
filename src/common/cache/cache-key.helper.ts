import { ExecutionContext } from '@nestjs/common';
import crypto from 'crypto';
import { Request } from 'express';
import { CacheKeyStrategy, CacheScope } from './cache.types';

type CacheKeyInput = {
  prefix: string;
  handlerName?: string;
  className?: string;
  scope: CacheScope;
  keyStrategy: CacheKeyStrategy;
  key?: string;
  args?: unknown[];
  context?: ExecutionContext;
};

export function buildCacheKey({
  prefix,
  handlerName,
  className,
  scope,
  keyStrategy,
  key,
  args,
  context,
}: CacheKeyInput): string {
  const base = key ?? `${className ?? 'unknown'}:${handlerName ?? 'handler'}`;
  const scopePart = scope === 'user' ? buildUserScope(context) : 'global';
  const strategyPart = buildStrategyKey(keyStrategy, context, args);
  return [prefix, base, scopePart, strategyPart].filter(Boolean).join(':');
}

export function buildUserScope(context?: ExecutionContext): string {
  if (!context) {
    return 'anonymous';
  }
  const http = context.switchToHttp();
  const request = http.getRequest<Request>();
  const user = (request as any)?.user;
  if (user?.id) {
    return `user:${user.id}`;
  }
  return 'anonymous';
}

export function buildStrategyKey(
  strategy: CacheKeyStrategy,
  context?: ExecutionContext,
  args?: unknown[],
): string {
  if (strategy === 'request' && context) {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const rawKey = {
      method: request?.method,
      path: request?.route?.path ?? request?.url,
      params: request?.params,
      query: request?.query,
      body: request?.body,
    };
    return hashObject(rawKey);
  }
  if (strategy === 'args') {
    return hashObject(args ?? []);
  }
  return 'static';
}

export function hashObject(value: unknown): string {
  const json = JSON.stringify(value, (_key, val) => {
    if (typeof val === 'bigint') {
      return val.toString();
    }
    return val;
  });
  return crypto.createHash('sha256').update(json).digest('hex');
}
