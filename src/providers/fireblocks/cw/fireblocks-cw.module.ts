import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from './core/fireblocks-core.module';
import { FireblocksWebhookModule } from './webhook/fireblocks-webhook.module';
import { CwDepositModule } from './deposit/cw-deposit.module';
import { CwPortfolioModule } from './portfolio/cw-portfolio.module';
import { CwTransfersModule } from './transfers/cw-transfers.module';
import { CwTransactionsModule } from './transactions/cw-transactions.module';
import { AdminSecurityModule } from './admin/security/admin-security.module';
import { AdminDestinationsModule } from './admin/destinations/admin-destinations.module';
import { AdminWithdrawalsModule } from './admin/withdrawals/admin-withdrawals.module';
import { AdminGasOperationsModule } from './admin/gas/admin-gas-operations.module';
import { AdminAuditModule } from './admin/audit/admin-audit.module';

@Module({
  imports: [
    FireblocksCoreModule,
    FireblocksWebhookModule,
    CwDepositModule,
    CwPortfolioModule,
    CwTransfersModule,
    CwTransactionsModule,
    AdminSecurityModule,
    AdminDestinationsModule,
    AdminWithdrawalsModule,
    AdminGasOperationsModule,
    AdminAuditModule,
  ],
  exports: [
    FireblocksCoreModule,
    FireblocksWebhookModule,
    CwDepositModule,
    CwPortfolioModule,
    CwTransfersModule,
    CwTransactionsModule,
    AdminSecurityModule,
    AdminDestinationsModule,
    AdminWithdrawalsModule,
    AdminGasOperationsModule,
    AdminAuditModule,
  ],
})
export class FireblocksCwModule {}
