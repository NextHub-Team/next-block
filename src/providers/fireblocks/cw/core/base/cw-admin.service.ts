import { Injectable } from '@nestjs/common';
import { FireblocksUserPortfolioDto } from '../../dto/fireblocks-wallet.dto';
import { FireblocksResilienceService } from '../shared/fireblocks-resilience.service';
import { AdminAuditService } from '../admin/services/admin-audit.service';
import { AdminDestinationsService } from '../admin/services/admin-destinations.service';
import { AdminGasOperationsService } from '../admin/services/admin-gas-operations.service';
import { AdminSecurityService } from '../admin/services/admin-security.service';
import { AdminWithdrawalsService } from '../admin/services/admin-withdrawals.service';

@Injectable()
export class CwAdminService {
  constructor(
    public readonly security: AdminSecurityService,
    public readonly destinations: AdminDestinationsService,
    public readonly withdrawals: AdminWithdrawalsService,
    public readonly gasOperations: AdminGasOperationsService,
    public readonly audit: AdminAuditService,
    public readonly resilience: FireblocksResilienceService,
  ) {}

  async getUserWallets(
    customerRefId: string,
  ): Promise<FireblocksUserPortfolioDto> {
    return this.audit.getUserWallets(customerRefId);
  }
}
