import { Injectable } from '@nestjs/common';
import { FireblocksResilienceService } from '../shared/fireblocks-resilience.service';
import { AdminAuditService } from './admin-audit.service';
import { AdminDestinationsService } from './admin-destinations.service';
import { AdminGasOperationsService } from './admin-gas-operations.service';
import { AdminSecurityService } from './admin-security.service';
import { AdminWithdrawalsService } from './admin-withdrawals.service';

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
}
