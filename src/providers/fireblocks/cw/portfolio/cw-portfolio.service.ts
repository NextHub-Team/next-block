import { Injectable, Logger } from '@nestjs/common';
import { FireblocksClientProvider } from '../../core/providers/fireblocks-client.provider';

@Injectable()
export class CwPortfolioService {
  private readonly logger = new Logger(CwPortfolioService.name);

  constructor(private readonly client: FireblocksClientProvider) {}

  async getBalances(vaultAccountId: string): Promise<void> {
    this.logger.log(`Fetch balances for vault ${vaultAccountId}`);
    this.logger.debug(`Using basePath ${this.client.getOptions().basePath}`);
  }

  async getSupportedAssets(): Promise<void> {
    this.logger.log('Fetch supported assets catalog');
  }
}
