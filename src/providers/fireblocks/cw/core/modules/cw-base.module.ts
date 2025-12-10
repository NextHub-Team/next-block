import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../fireblocks-core.module';
import { AdminAuditModule } from './admin-audit.module';
import { AdminDestinationsModule } from './admin-destinations.module';
import { AdminGasOperationsModule } from './admin-gas-operations.module';
import { AdminSecurityModule } from './admin-security.module';
import { AdminWithdrawalsModule } from './admin-withdrawals.module';
import { CwDepositModule } from './cw-deposit.module';
import { CwPortfolioModule } from './cw-portfolio.module';
import { CwTransactionsModule } from './cw-transactions.module';
import { CwTransfersModule } from './cw-transfers.module';
import { CwAdminService } from '../services/cw-admin.service';
import { CwBaseService } from '../services/cw-base.service';
import { CwClientService } from '../services/cw-client.service';

@Module({
  imports: [
    FireblocksCoreModule,
    AdminSecurityModule,
    AdminDestinationsModule,
    AdminWithdrawalsModule,
    AdminGasOperationsModule,
    AdminAuditModule,
    CwDepositModule,
    CwPortfolioModule,
    CwTransfersModule,
    CwTransactionsModule,
  ],
  providers: [CwAdminService, CwClientService, CwBaseService],
  exports: [CwAdminService, CwClientService, CwBaseService],
})
export class CwBaseModule {}
