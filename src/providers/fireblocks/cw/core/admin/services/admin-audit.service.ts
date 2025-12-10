import { Injectable } from '@nestjs/common';
import { AbstractClientAdminService } from '../base/abstract-client-admin.service';
import { FireblocksClientService } from '../../shared/fireblocks-client.service';

@Injectable()
export class AdminAuditService extends AbstractClientAdminService {
  constructor(client: FireblocksClientService) {
    super(AdminAuditService.name, client);
  }

  async getLogs(): Promise<void> {
    this.logAction('Retrieving system audit logs');
    this.debugBasePath();
  }
}
