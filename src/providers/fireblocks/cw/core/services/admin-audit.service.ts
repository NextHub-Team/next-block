import { Injectable, Logger } from '@nestjs/common';
import { FireblocksClientService } from '../shared/fireblocks-client.service';

@Injectable()
export class AdminAuditService {
  private readonly logger = new Logger(AdminAuditService.name);

  constructor(private readonly client: FireblocksClientService) {}

  async getLogs(): Promise<void> {
    this.logger.log('Retrieving system audit logs');
    this.logger.debug(`Using basePath ${this.client.getOptions().basePath}`);
  }
}
