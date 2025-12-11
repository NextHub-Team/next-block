import { Injectable } from '@nestjs/common';
import { AbstractCwService } from '../base/abstract-cw.service';
import { FireblocksResilienceService } from '../../shared/fireblocks-resilience.service';

@Injectable()
export class AdminSecurityService extends AbstractCwService {
  constructor(private readonly resilience: FireblocksResilienceService) {
    super(AdminSecurityService.name);
  }

  verifyWebhookHealth(): void {
    this.logAction('Webhook verification health check');
  }

  recordSecurityEvent(reason: string): void {
    this.resilience.recordSecurityEvent(reason);
  }
}
