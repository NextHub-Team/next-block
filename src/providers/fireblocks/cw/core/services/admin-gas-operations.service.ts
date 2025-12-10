import { Injectable, Logger } from '@nestjs/common';
import { FireblocksClientService } from '../shared/fireblocks-client.service';

@Injectable()
export class AdminGasOperationsService {
  private readonly logger = new Logger(AdminGasOperationsService.name);

  constructor(private readonly client: FireblocksClientService) {}

  async allocateGas(vaultAccountId: string, amount: string): Promise<void> {
    this.logger.log(`Allocating gas ${amount} to vault ${vaultAccountId}`);
    this.logger.debug(`Using basePath ${this.client.getOptions().basePath}`);
  }
}
