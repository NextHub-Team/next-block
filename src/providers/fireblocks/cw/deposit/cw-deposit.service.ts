import { Injectable, Logger } from '@nestjs/common';
import { FireblocksClientProvider } from '../../core/providers/fireblocks-client.provider';

@Injectable()
export class CwDepositService {
  private readonly logger = new Logger(CwDepositService.name);

  constructor(private readonly client: FireblocksClientProvider) {}

  async activateAssetInVault(vaultAccountId: string, assetId: string): Promise<void> {
    this.logger.log(`Activate asset ${assetId} in vault ${vaultAccountId}`);
    this.logger.debug(`Using basePath ${this.client.getOptions().basePath}`);
  }

  async createDepositAddress(vaultAccountId: string, assetId: string): Promise<void> {
    this.logger.log(`Create deposit address for ${assetId} in vault ${vaultAccountId}`);
  }
}
