import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createQueueDashExpressMiddleware } from '@queuedash/api';
import { NextFunction, Request, Response } from 'express';
import { QueueDashRegistry } from './queuedash.registry';
import { AllConfigType } from '../../config/config.type';
import { LoggerService } from '../logger/logger.service';

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

async function logQueueDashUi(
  app: INestApplication,
  mountPath: string,
  logger: LoggerService,
): Promise<void> {
  if (queuedashUiLogged) return;

  const maxAttempts = 5;
  const delayMs = 500;

  const writeLog = async (attempt = 0): Promise<void> => {
    if (queuedashUiLogged) return;
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
      logger.warn(
        `QueueDash UI URL could not be resolved: ${message}`,
        'QueueDashBootstrap',
      );
    } finally {
      // Allow retries until maxAttempts; otherwise, stop after success.
      if (!queuedashUiLogged && attempt >= maxAttempts) {
        queuedashUiLogged = true;
      }
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
