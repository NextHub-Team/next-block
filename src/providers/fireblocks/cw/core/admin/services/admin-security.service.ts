import { Injectable } from '@nestjs/common';
import { AbstractAdminService } from '../base/abstract-admin.service';
import { FireblocksResilienceService } from '../../shared/fireblocks-resilience.service';

@Injectable()
export class AdminSecurityService extends AbstractAdminService {
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
