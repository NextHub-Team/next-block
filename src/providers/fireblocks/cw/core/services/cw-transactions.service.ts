import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { FireblocksCwService } from '../../fireblocks-cw.service';

@Injectable()
export class CwTransactionsService {
  private readonly logger = new Logger(CwTransactionsService.name);

  constructor(
    @Inject(forwardRef(() => FireblocksCwService))
    private readonly client: FireblocksCwService,
  ) {}

  async listTransactions(vaultAccountId: string): Promise<void> {
    this.logger.log(`List transactions for vault ${vaultAccountId}`);
    this.logger.debug(`Using basePath ${this.client.getOptions().basePath}`);
  }
}
