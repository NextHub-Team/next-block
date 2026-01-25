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
  const routeBase =
    keyStrategy === 'route' ? resolveRequestPath(context) : undefined;
  const base =
    key ?? routeBase ?? `${className ?? 'unknown'}:${handlerName ?? 'handler'}`;
  const scopePart = buildScopeKey(scope, context);
  const strategyPart = buildStrategyKey(keyStrategy, context, args);
  return [prefix, base, scopePart, strategyPart].filter(Boolean).join(':');
}

export function buildScopeKey(
  scope: CacheScope,
  context?: ExecutionContext,
): string {
  if (scope === 'user') {
    return buildUserScope(context);
  }
  if (scope === 'admin') {
    return 'admin';
  }
  return 'global';
}

export function buildUserScope(context?: ExecutionContext): string {
  if (!context) {
    return 'anonymous';
  }
  const http = context.switchToHttp();
  const request = http.getRequest<Request>();
  const user = (request as any)?.user;
  const userId = user?.id ?? user?.uid;
  if (userId) {
    return `user:${userId}`;
  }
  return 'anonymous';
}

export function buildStrategyKey(
  strategy: CacheKeyStrategy,
  context?: ExecutionContext,
  args?: unknown[],
): string {
  if (strategy === 'route' && context) {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const rawKey = {
      path: resolveRequestPath(context),
      body: request?.body,
    };
    return hashObject(rawKey);
  }
  if (strategy === 'request' && context) {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const rawKey = {
      method: request?.method,
      path: resolveRequestPath(context),
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

function resolveRequestPath(context?: ExecutionContext): string | undefined {
  if (!context) {
    return undefined;
  }
  const http = context.switchToHttp();
  const request = http.getRequest<Request>();
  return request?.route?.path ?? request?.path ?? request?.url;
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
