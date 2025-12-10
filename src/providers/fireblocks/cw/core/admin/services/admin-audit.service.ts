import { Injectable } from '@nestjs/common';
import { AbstractCwService } from '../base/abstract-cw.service';
import { FireblocksCwService } from '../../../fireblocks-cw.service';

@Injectable()
export class AdminAuditService extends AbstractCwService {
  constructor(client: FireblocksCwService) {
    super(AdminAuditService.name, client);
  }

  async getLogs(): Promise<void> {
    this.logAction('Retrieving system audit logs');
    this.debugBasePath();
  }
}
