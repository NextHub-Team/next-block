import { Injectable } from '@nestjs/common';
import { AbstractCwService } from '../base/abstract-cw.service';
import { FireblocksCwService } from '../../../fireblocks-cw.service';

@Injectable()
export class AdminGasOperationsService extends AbstractCwService {
  constructor(client: FireblocksCwService) {
    super(AdminGasOperationsService.name, client);
  }

  async allocateGas(vaultAccountId: string, amount: string): Promise<void> {
    this.logAction(`Allocating gas ${amount} to vault ${vaultAccountId}`);
    this.debugBasePath();
  }
}
