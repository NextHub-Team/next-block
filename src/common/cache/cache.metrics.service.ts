import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';
import { CacheConfig } from './config/cache-config.type';

type CacheCounterKey =
  | 'hits'
  | 'misses'
  | 'stale'
  | 'sets'
  | 'evicts'
  | 'refreshes'
  | 'errors';

type CacheCounter = {
  name: string;
  help: string;
  value: number;
};

@Injectable()
export class CacheMetricsService {
  private readonly enabled: boolean;
  private readonly prefix: string;
  private readonly counters: Record<CacheCounterKey, CacheCounter>;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    const config = this.configService.get('cache', {
      infer: true,
    }) as CacheConfig;
    this.enabled = Boolean(config?.enable && config?.metricsEnable);
    this.prefix = config?.metricsPrefix ?? 'cache';
    this.counters = {
      hits: this.counter('hits_total', 'Total cache hits.'),
      misses: this.counter('misses_total', 'Total cache misses.'),
      stale: this.counter('stale_total', 'Total stale cache reads.'),
      sets: this.counter('sets_total', 'Total cache writes.'),
      evicts: this.counter('evicts_total', 'Total cache evictions.'),
      refreshes: this.counter('refreshes_total', 'Total cache refreshes.'),
      errors: this.counter('errors_total', 'Total cache errors.'),
    };
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  hit(): void {
    this.increment('hits');
  }

  miss(): void {
    this.increment('misses');
  }

  stale(): void {
    this.increment('stale');
  }

  set(): void {
    this.increment('sets');
  }

  evict(): void {
    this.increment('evicts');
  }

  refresh(): void {
    this.increment('refreshes');
  }

  error(): void {
    this.increment('errors');
  }

  getPrometheusMetrics(): string {
    if (!this.enabled) {
      return '';
    }
    const lines: string[] = [];
    const metrics = Object.values(this.counters);
    for (const metric of metrics) {
      lines.push(`# HELP ${metric.name} ${metric.help}`);
      lines.push(`# TYPE ${metric.name} counter`);
      lines.push(`${metric.name} ${metric.value}`);
    }
    return `${lines.join('\n')}\n`;
  }

  private increment(key: CacheCounterKey): void {
    if (!this.enabled) {
      return;
    }
    this.counters[key].value += 1;
  }

  private counter(suffix: string, help: string): CacheCounter {
    return {
      name: `${this.prefix}_${suffix}`,
      help,
      value: 0,
    };
  }
}
