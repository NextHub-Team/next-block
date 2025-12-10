import { Injectable } from '@nestjs/common';
import { AbstractClientAdminService } from '../base/abstract-client-admin.service';
import { FireblocksClientService } from '../../shared/fireblocks-client.service';

@Injectable()
export class AdminGasOperationsService extends AbstractClientAdminService {
  constructor(client: FireblocksClientService) {
    super(AdminGasOperationsService.name, client);
  }

  async allocateGas(vaultAccountId: string, amount: string): Promise<void> {
    this.logAction(`Allocating gas ${amount} to vault ${vaultAccountId}`);
    this.debugBasePath();
  }
}
