import { Injectable, Logger } from '@nestjs/common';
import { FireblocksClientProvider } from '../providers/fireblocks-client.provider';

@Injectable()
export class CwTransactionsService {
  private readonly logger = new Logger(CwTransactionsService.name);

  constructor(private readonly client: FireblocksClientProvider) {}

  async listTransactions(vaultAccountId: string): Promise<void> {
    this.logger.log(`List transactions for vault ${vaultAccountId}`);
    this.logger.debug(`Using basePath ${this.client.getOptions().basePath}`);
  }
}
