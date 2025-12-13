import { Injectable } from '@nestjs/common';
import { FireblocksUserPortfolioDto } from '../../dto/fireblocks-wallet.dto';
import { FireblocksResponseEnvelopeDto } from '../../dto/fireblocks-response.dto';
import { FireblocksResilienceService } from '../shared/fireblocks-resilience.service';
import { AdminVaultService } from '../admin/services/admin-vault.service';
import { AdminWithdrawalsService } from '../admin/services/admin-withdrawals.service';

@Injectable()
export class CwAdminService {
  constructor(
    public readonly withdrawals: AdminWithdrawalsService,
    public readonly vaults: AdminVaultService,
    public readonly resilience: FireblocksResilienceService,
  ) {}

  async getUserWallets(
    customerRefId: string,
  ): Promise<FireblocksResponseEnvelopeDto<FireblocksUserPortfolioDto>> {
    return this.vaults.fetchUserPortfolioByCustomerRefId(customerRefId);
  }
}
