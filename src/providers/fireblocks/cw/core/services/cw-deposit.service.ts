import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { FireblocksCwService } from '../../fireblocks-cw.service';

@Injectable()
export class CwDepositService {
  private readonly logger = new Logger(CwDepositService.name);

  constructor(
    @Inject(forwardRef(() => FireblocksCwService))
    private readonly client: FireblocksCwService,
  ) {}

  async activateAssetInVault(vaultAccountId: string, assetId: string): Promise<void> {
    this.logger.log(`Activate asset ${assetId} in vault ${vaultAccountId}`);
    this.logger.debug(`Using environment ${this.client.getOptions().envType}`);
  }

  async createDepositAddress(vaultAccountId: string, assetId: string): Promise<void> {
    this.logger.log(`Create deposit address for ${assetId} in vault ${vaultAccountId}`);
  }
}
