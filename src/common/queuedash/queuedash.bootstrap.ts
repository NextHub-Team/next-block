import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createQueueDashExpressMiddleware } from '@queuedash/api';
import { Queue, QueueEvents } from 'bullmq';
import { NextFunction, Request, Response } from 'express';
import { fromEventPattern, merge, Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { AllConfigType } from '../../config/config.type';
import { LoggerService } from '../logger/logger.service';
import { QueueDashRegistry } from './queuedash.registry';
import {
  BullMqQueueBinding,
  DEFAULT_QUEUES,
  QueueDashBullMqEnv,
  QueueDefinition,
  QueueEventPayload,
} from './types/queuedash-bullmq.type';

function parseEnv(): QueueDashBullMqEnv {
  const enabled =
    process.env.QUEUEDASH_BULLMQ_ENABLE === undefined
      ? true
      : String(process.env.QUEUEDASH_BULLMQ_ENABLE) === 'true';

  return {
    enabled,
    redisUrl:
      process.env.QUEUEDASH_REDIS_URL ??
      process.env.REDIS_URL ??
      'redis://localhost:6379',
  };
}

function parseRedisUrl(url: string): {
  host: string;
  port: number;
  username?: string;
  password?: string;
  db?: number;
  tls?: Record<string, unknown>;
} {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 6379,
      username: parsed.username || undefined,
      password: parsed.password || undefined,
      db: parsed.pathname ? Number(parsed.pathname.slice(1) || 0) : undefined,
      tls: parsed.protocol === 'rediss:' ? {} : undefined,
    };
  } catch {
    return { host: 'localhost', port: 6379 };
  }
}

function createQueueEventsObservable(
  queueEvents: QueueEvents,
  queueName: string,
): Observable<QueueEventPayload> {
  const bind = (
    event: QueueEventPayload['event'],
    mapper: (payload: any) => QueueEventPayload,
  ) =>
    fromEventPattern<any>(
      (handler) => queueEvents.on(event, handler),
      (handler) => queueEvents.off(event, handler),
    ).pipe(map(mapper));

  return merge(
    bind('waiting', ({ jobId }) => ({ queueName, event: 'waiting', jobId })),
    bind('active', ({ jobId }) => ({ queueName, event: 'active', jobId })),
    bind('completed', ({ jobId, returnvalue }) => ({
      queueName,
      event: 'completed',
      jobId,
      data: returnvalue,
    })),
    bind('failed', ({ jobId, failedReason, attemptsMade }) => ({
      queueName,
      event: 'failed',
      jobId,
      data: failedReason,
      attempt: attemptsMade,
    })),
  ).pipe(share());
}

export function bootstrapBullMqQueues(
  app: INestApplication,
  definitions: QueueDefinition[] = DEFAULT_QUEUES,
): BullMqQueueBinding[] {
  const logger = app.get(LoggerService);
  const registry = app.get(QueueDashRegistry);
  const env = parseEnv();

  if (!env.enabled) {
    logger.log(
      'BullMQ queues disabled (set QUEUEDASH_BULLMQ_ENABLE=true to enable)',
      'QueueDashBullMQ',
    );
    return [];
  }

  if (definitions.length === 0) {
    logger.warn(
      'BullMQ bootstrapped with no queue definitions',
      'QueueDashBullMQ',
    );
    return [];
  }

  const connectionOptions = parseRedisUrl(env.redisUrl);
  logger.debug(
    `BullMQ connection resolved (host=${connectionOptions.host}, port=${connectionOptions.port}, db=${connectionOptions.db ?? 0}, tls=${connectionOptions.tls ? 'on' : 'off'})`,
    'QueueDashBullMQ',
  );
  const bindings: BullMqQueueBinding[] = [];

  for (const definition of definitions) {
    const queue = new Queue(definition.name, { connection: connectionOptions });
    const queueEvents = new QueueEvents(definition.name, {
      connection: connectionOptions,
    });

    void queue
      .waitUntilReady()
      .catch((err) =>
        logger.error(
          `Failed to init BullMQ queue (name=${definition.name}): ${err?.message ?? err}`,
          (err as any)?.stack,
          'QueueDashBullMQ',
        ),
      );

    void queueEvents
      .waitUntilReady()
      .catch((err) =>
        logger.error(
          `Failed to init BullMQ events stream (queue=${definition.name}): ${err?.message ?? err}`,
          (err as any)?.stack,
          'QueueDashBullMQ',
        ),
      );

    queueEvents.on('error', (err) =>
      logger.error(
        `BullMQ queue event error (queue=${definition.name}): ${err?.message ?? err}`,
        (err as any)?.stack,
        'QueueDashBullMQ',
      ),
    );

    const events$ = createQueueEventsObservable(queueEvents, definition.name);
    logger.debug(
      `BullMQ event stream wired (queue=${definition.name})`,
      'QueueDashBullMQ',
    );

    registry.registerBullMqQueue(queue, definition.displayName);
    logger.log(
      `BullMQ queue registered (displayName=${definition.displayName}, name=${definition.name}, redis=${env.redisUrl})`,
      'QueueDashBullMQ',
    );

    bindings.push({
      definition,
      queue,
      queueEvents,
      events$,
    });
  }

  const httpServer = app.getHttpServer();
  if (httpServer?.on) {
    const closeAll = async () => {
      await Promise.allSettled(
        bindings.map((binding) => binding.queueEvents.close()),
      );
      await Promise.allSettled(
        bindings.map((binding) => binding.queue.close()),
      );
    };
    httpServer.on('close', closeAll);
  }

  return bindings;
}

type QueueDashBootstrapOptions = {
  /**
   * Full base path (including global prefix) to mount QueueDash API, e.g. `/api/queuedash`.
   * Defaults to `/${app.apiPrefix}/queuedash`.
   */
  path?: string;
  /**
   * Enable QueueDash. Defaults to `queuedash.enable` config.
   */
  enabled?: boolean;
};

function normalizePrefix(prefix: string): string {
  return prefix.startsWith('/') ? prefix.slice(1) : prefix;
}

function resolveMountPath(options: {
  apiPrefix: string;
  configuredPath: string;
  overridePath?: string;
}): string {
  const apiPrefix = normalizePrefix(options.apiPrefix);
  const base = options.overridePath ?? options.configuredPath;

  if (base.startsWith('/')) {
    return base;
  }

  return `/${apiPrefix}/${base}`;
}

let queuedashUiLogged = false;

function logQueueDashUi(
  app: INestApplication,
  mountPath: string,
  logger: LoggerService,
): void {
  if (queuedashUiLogged) return;

  const maxAttempts = 5;
  const delayMs = 500;

  const writeLog = async (attempt = 0): Promise<void> => {
    if (queuedashUiLogged) return;
    const httpServer = app.getHttpServer?.();
    const isListening = !!httpServer && httpServer.listening === true;

    if (!isListening) {
      // If we have a server instance, listen for the event only on the first attempt.
      if (
        attempt === 0 &&
        httpServer &&
        typeof httpServer.once === 'function'
      ) {
        httpServer.once('listening', () => void writeLog(attempt + 1));
        return;
      }

      if (attempt < maxAttempts) {
        setTimeout(() => void writeLog(attempt + 1), delayMs);
      } else {
        queuedashUiLogged = true;
        logger.warn(
          'QueueDash UI URL could not be resolved: HTTP server is not listening',
          'QueueDashBootstrap',
        );
      }
      return;
    }

    try {
      const appUrl = (await app.getUrl()).replace('[::1]', 'localhost');
      const normalizedUrl = appUrl.replace(/\/+$/, '');
      queuedashUiLogged = true;
      logger.log(
        `[QueueDash] UI available at: ${normalizedUrl}${mountPath}`,
        'QueueDashBootstrap',
      );
      return;
    } catch (err) {
      const message = (err as any)?.message ?? String(err);
      if (message.includes('app.listen') && attempt < maxAttempts) {
        logger.debug(
          `QueueDash UI log waiting for server (attempt ${attempt + 1}/${maxAttempts})`,
          'QueueDashBootstrap',
        );
        setTimeout(() => void writeLog(attempt + 1), delayMs);
        return;
      }
      queuedashUiLogged = true;
      logger.warn(
        `QueueDash UI URL could not be resolved: ${message}`,
        'QueueDashBootstrap',
      );
    }
  };

  const httpServer = app.getHttpServer();
  if (
    httpServer &&
    typeof httpServer.once === 'function' &&
    httpServer.listening !== true
  ) {
    // Wait until the Nest HTTP server is actually listening before calling getUrl()
    httpServer.once('listening', () => void writeLog());
    return;
  }

  void writeLog();
}

export function bootstrapQueueDash(
  app: INestApplication,
  options: QueueDashBootstrapOptions = {},
): void {
  const logger = app.get(LoggerService);
  const configService = app.get(ConfigService<AllConfigType>);
  const apiPrefix = configService.getOrThrow('app.apiPrefix', { infer: true });
  const queuedashConfig = configService.getOrThrow('queuedash', {
    infer: true,
  });

  const enabled =
    typeof options.enabled === 'boolean'
      ? options.enabled
      : queuedashConfig.enable;

  if (!enabled) {
    logger.log('QueueDash disabled', 'QueueDashBootstrap');
    return;
  }

  const mountPath = resolveMountPath({
    apiPrefix,
    configuredPath: queuedashConfig.path,
    overridePath: options.path,
  });
  logger.debug(
    `QueueDash path resolved (enabled=${enabled}, mount=${mountPath}, logRequests=${queuedashConfig.logRequests})`,
    'QueueDashBootstrap',
  );
  const registry = app.get(QueueDashRegistry);

  const registeredQueues = registry.getQueues();
  const queueSummary = registeredQueues
    .map((q) => `${q.displayName}(${q.type})`)
    .join(', ');
  if (registeredQueues.length === 0) {
    logger.warn(
      'QueueDash enabled but no queues registered yet',
      'QueueDashBootstrap',
    );
  }

  logger.log(
    `QueueDash mounting at ${mountPath} (logRequests=${queuedashConfig.logRequests}, queues=${registeredQueues.length}${queueSummary ? `: ${queueSummary}` : ''})`,
    'QueueDashBootstrap',
  );

  const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    if (!queuedashConfig.logRequests) {
      return next();
    }

    const start = Date.now();
    const url = (req as any).originalUrl ?? req.url;

    res.once('finish', () => {
      const ms = Date.now() - start;
      logger.debug(
        `${req.method} ${url} -> ${res.statusCode} (${ms}ms)`,
        'QueueDashHTTP',
      );
    });

    next();
  };

  const context = {
    get queues() {
      return registry.getQueues();
    },
  };

  const queuedashHandler = createQueueDashExpressMiddleware({
    // QueueDash expects Bull/BullMQ/etc queues at runtime.
    // Our registry intentionally keeps the queue type as `unknown` so any adapter can be registered.
    ctx: context as any,
  });

  app.use(
    mountPath,
    requestLogger,
    (req: Request, res: Response, next: NextFunction) => {
      queuedashHandler(req, res, (err) => {
        if (res.headersSent || res.writableEnded) {
          return;
        }
        next(err);
      });
    },
  );

  void logQueueDashUi(app, mountPath, logger);
}
