import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InternalEventOutboxEntity } from './entities/internal-event-outbox.entity';
import { InternalEventsRedisService } from './internal-events.redis.service';
import { INTERNAL_EVENTS_OPTIONS } from './internal-events.constants';
import { InternalEventsModuleOptions } from './internal-events.types';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class InternalEventsDispatcher {
  private interval: NodeJS.Timeout | null = null;
  private lastCleanupAt = 0;

  constructor(
    private readonly dataSource: DataSource,
    private readonly redisService: InternalEventsRedisService,
    private readonly loggerService: LoggerService,
    @Inject(INTERNAL_EVENTS_OPTIONS)
    private readonly options: InternalEventsModuleOptions,
  ) {}

  onModuleInit() {
    this.interval = setInterval(() => {
      void this.dispatchOnce();
    }, this.options.dispatchIntervalMs);
  }

  onModuleDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private async dispatchOnce() {
    const redis = this.redisService.getClient();

    try {
      const outboxRows = await this.dataSource.transaction(async (manager) => {
        return manager
          .createQueryBuilder(InternalEventOutboxEntity, 'outbox')
          .setLock('pessimistic_write')
          .setOnLocked('skip_locked')
          .where('outbox.publishedAt IS NULL')
          .orderBy('outbox.createdAt', 'ASC')
          .limit(this.options.dispatchBatchSize)
          .getMany();
      });

      if (!outboxRows.length) {
        await this.maybeCleanup();
        return;
      }

      for (const row of outboxRows) {
        const payload = JSON.stringify(row.payload ?? {});
        const xaddArgs: (string | number)[] = [this.options.streamName];

        if (this.options.streamTrimMaxLen) {
          xaddArgs.push('MAXLEN', '~', this.options.streamTrimMaxLen);
        }

        xaddArgs.push(
          '*',
          'eventId',
          row.id,
          'eventType',
          row.eventType,
          'payload',
          payload,
          'occurredAt',
          row.createdAt.toISOString(),
        );

        await (redis as any).xadd(...xaddArgs);

        await this.dataSource
          .createQueryBuilder()
          .update(InternalEventOutboxEntity)
          .set({ publishedAt: new Date() })
          .where('id = :id', { id: row.id })
          .execute();
      }

      await this.maybeCleanup();
    } catch (error) {
      const reason = (error as Error)?.message ?? String(error);
      this.loggerService.warn(
        `InternalEventsDispatcher dispatch failed: ${reason}`,
        InternalEventsDispatcher.name,
      );
    }
  }

  private async maybeCleanup() {
    const now = Date.now();
    const cleanupIntervalMs = 60 * 60 * 1000;
    if (now - this.lastCleanupAt < cleanupIntervalMs) return;
    this.lastCleanupAt = now;

    const retentionMs = this.options.outboxRetentionDays * 24 * 60 * 60 * 1000;
    const cutoff = new Date(Date.now() - retentionMs);

    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(InternalEventOutboxEntity)
      .where('publishedAt IS NOT NULL')
      .andWhere('publishedAt < :cutoff', { cutoff })
      .execute();
  }
}
