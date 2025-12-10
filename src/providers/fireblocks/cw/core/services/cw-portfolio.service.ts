import { Injectable, Logger } from '@nestjs/common';
import { FireblocksClientService } from '../shared/fireblocks-client.service';

@Injectable()
export class CwPortfolioService {
  private readonly logger = new Logger(CwPortfolioService.name);

  constructor(private readonly client: FireblocksClientService) {}

  async getBalances(vaultAccountId: string): Promise<void> {
    this.logger.log(`Fetch balances for vault ${vaultAccountId}`);
    this.logger.debug(`Using basePath ${this.client.getOptions().basePath}`);
  }

  async getSupportedAssets(): Promise<void> {
    this.logger.log('Fetch supported assets catalog');
  }
}
