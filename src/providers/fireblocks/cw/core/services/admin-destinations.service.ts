import { Injectable, Logger } from '@nestjs/common';
import { FireblocksClientProvider } from '../providers/fireblocks-client.provider';

@Injectable()
export class AdminDestinationsService {
  private readonly logger = new Logger(AdminDestinationsService.name);

  constructor(private readonly client: FireblocksClientProvider) {}

  async allowlistBeneficiary(walletId: string): Promise<void> {
    this.logger.log(`Allowlisting beneficiary wallet ${walletId}`);
    this.logger.debug(`Using basePath ${this.client.getOptions().basePath}`);
  }

  async manageInternalWallet(walletId: string): Promise<void> {
    this.logger.log(`Managing internal wallet ${walletId}`);
  }
}
