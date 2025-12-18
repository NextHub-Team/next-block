import { INestApplication } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';
import { fromEventPattern, merge, Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';
import { QueueDashRegistry } from './queuedash.registry';

export type QueueDefinition = {
  name: string;
  displayName: string;
};

export type QueueDashBullMqEnv = {
  enabled: boolean;
  redisUrl: string;
};

export type QueueEventPayload = {
  queueName: string;
  event: 'waiting' | 'active' | 'completed' | 'failed';
  jobId?: string;
  data?: unknown;
  attempt?: number;
};

export type BullMqQueueBinding = {
  definition: QueueDefinition;
  queue: Queue;
  queueEvents: QueueEvents;
  events$: Observable<QueueEventPayload>;
};

const DEFAULT_QUEUES: QueueDefinition[] = [
  { name: 'login-events', displayName: 'Login Events' },
  {
    name: 'contract-address-events',
    displayName: 'Contract Address Events',
  },
  { name: 'account-events', displayName: 'Account Events' },
];

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
