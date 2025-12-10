import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../fireblocks-core.module';
import { AdminAuditModule } from '../admin/modules/admin-audit.module';
import { AdminDestinationsModule } from '../admin/modules/admin-destinations.module';
import { AdminGasOperationsModule } from '../admin/modules/admin-gas-operations.module';
import { AdminSecurityModule } from '../admin/modules/admin-security.module';
import { AdminWithdrawalsModule } from '../admin/modules/admin-withdrawals.module';
import { CwDepositModule } from './cw-deposit.module';
import { CwPortfolioModule } from './cw-portfolio.module';
import { CwTransactionsModule } from './cw-transactions.module';
import { CwTransfersModule } from './cw-transfers.module';
import { CwAdminService } from '../base/cw-admin.service';
import { CwBaseService } from '../base/cw-base.service';
import { CwClientService } from '../base/cw-client.service';

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
