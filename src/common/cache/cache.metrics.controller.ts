import {
  Controller,
  Get,
  Header,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { CacheMetricsService } from './cache.metrics.service';

@Controller('metrics/cache')
export class CacheMetricsController {
  constructor(private readonly metrics: CacheMetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4')
  @HttpCode(200)
  getMetrics(): string {
    if (!this.metrics.isEnabled()) {
      throw new NotFoundException('Cache metrics disabled');
    }
    return this.metrics.getPrometheusMetrics();
  }
}
