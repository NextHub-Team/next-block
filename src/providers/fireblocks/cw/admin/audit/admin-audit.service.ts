import { Injectable, Logger } from '@nestjs/common';
import { FireblocksClientProvider } from '../../core/providers/fireblocks-client.provider';

@Injectable()
export class AdminAuditService {
  private readonly logger = new Logger(AdminAuditService.name);

  constructor(private readonly client: FireblocksClientProvider) {}

  async fetchAuditLogs(): Promise<void> {
    this.logger.log('Fetch Fireblocks audit logs');
    this.logger.debug(`Using basePath ${this.client.getOptions().basePath}`);
  }
}
