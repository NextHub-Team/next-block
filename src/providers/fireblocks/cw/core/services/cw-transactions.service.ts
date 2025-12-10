import { Injectable, Logger } from '@nestjs/common';
import { FireblocksClientService } from '../shared/fireblocks-client.service';

@Injectable()
export class CwTransactionsService {
  private readonly logger = new Logger(CwTransactionsService.name);

  constructor(private readonly client: FireblocksClientService) {}

  async listTransactions(vaultAccountId: string): Promise<void> {
    this.logger.log(`List transactions for vault ${vaultAccountId}`);
    this.logger.debug(`Using basePath ${this.client.getOptions().basePath}`);
  }
}
