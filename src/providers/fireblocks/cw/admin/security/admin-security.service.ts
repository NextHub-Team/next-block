import { Injectable, Logger } from '@nestjs/common';
import { FireblocksResilience } from '../../core/providers/fireblocks-resilience';

@Injectable()
export class AdminSecurityService {
  private readonly logger = new Logger(AdminSecurityService.name);

  constructor(private readonly resilience: FireblocksResilience) {}

  verifyWebhookHealth(): void {
    this.logger.log('Webhook verification health check');
  }

  recordSecurityEvent(reason: string): void {
    this.resilience.recordSecurityEvent(reason);
  }
}
