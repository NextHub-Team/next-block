import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';
import { LoggerService } from '../logger/logger.service';
import {
  bootstrapBullMqQueues,
  bootstrapQueueDash,
} from './queuedash.bootstrap';
import { QueueDashRegistry } from './queuedash.registry';

function resolveMountPath(apiPrefix: string, configuredPath: string): string {
  const normalizedPrefix = apiPrefix.startsWith('/')
    ? apiPrefix.slice(1)
    : apiPrefix;

  if (configuredPath.startsWith('/')) {
    return configuredPath;
  }

  return `/${normalizedPrefix}/${configuredPath}`;
}

export class QueueDashManager {
  static bootstrap(app: INestApplication): void {
    bootstrapBullMqQueues(app);
    bootstrapQueueDash(app);
  }

  static async info(app: INestApplication): Promise<void> {
    const logger = app.get(LoggerService);
    const configService = app.get(ConfigService<AllConfigType>);
    const queuedashConfig = configService.get('queuedash', { infer: true });

    if (!queuedashConfig?.enable) {
      logger.debug('QueueDash info skipped (disabled)', 'QueueDashManager');
      return;
    }

    const apiPrefix = configService.getOrThrow('app.apiPrefix', {
      infer: true,
    });
    const mountPath = resolveMountPath(apiPrefix, queuedashConfig.path);

    const httpServer = app.getHttpServer?.();
    if (
      httpServer &&
      typeof httpServer.once === 'function' &&
      httpServer.listening !== true
    ) {
      await new Promise<void>((resolve) =>
        httpServer.once('listening', () => resolve()),
      );
    }

    if (!httpServer || httpServer.listening !== true) {
      logger.debug(
        'Skipping QueueDash info log because HTTP server is not listening yet',
        'QueueDashManager',
      );
      return;
    }

    try {
      const appUrl = (await app.getUrl()).replace('[::1]', 'localhost');
      const registry = app.get(QueueDashRegistry);
      const queues = registry.getQueues();
      const summary = queues
        .map((q) => `${q.displayName}(${q.type})`)
        .join(', ');

      const normalizedUrl = appUrl.replace(/\/+$/, '');
      const summaryText = summary ? `: ${summary}` : '';
      logger.log(
        `[QueueDash] mounted at ${normalizedUrl}${mountPath} (queues=${queues.length}${summaryText}, logRequests=${queuedashConfig.logRequests})`,
        'QueueDashManager',
      );
    } catch (error: unknown) {
      logger.error(
        `Unable to resolve app URL for QueueDash info: ${
          (error as any)?.message ?? error
        }`,
        (error as any)?.stack,
        'QueueDashManager',
      );
    }
  }
}
