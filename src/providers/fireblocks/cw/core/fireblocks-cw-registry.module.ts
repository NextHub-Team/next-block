import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from './fireblocks-core.module';
import { FireblocksCwRegistryService } from './fireblocks-cw-registry.service';
import { AdminAuditModule } from './admin/modules/admin-audit.module';
import { AdminDestinationsModule } from './admin/modules/admin-destinations.module';
import { AdminGasOperationsModule } from './admin/modules/admin-gas-operations.module';
import { AdminSecurityModule } from './admin/modules/admin-security.module';
import { AdminWithdrawalsModule } from './admin/modules/admin-withdrawals.module';
import { CwDepositModule } from './modules/cw-deposit.module';
import { CwPortfolioModule } from './modules/cw-portfolio.module';
import { CwTransactionsModule } from './modules/cw-transactions.module';
import { CwTransfersModule } from './modules/cw-transfers.module';

const ADMIN_MODULES = [
  AdminSecurityModule,
  AdminDestinationsModule,
  AdminWithdrawalsModule,
  AdminGasOperationsModule,
  AdminAuditModule,
];

const NON_ADMIN_MODULES = [
  CwDepositModule,
  CwPortfolioModule,
  CwTransfersModule,
  CwTransactionsModule,
];

@Module({
  imports: [FireblocksCoreModule, ...ADMIN_MODULES, ...NON_ADMIN_MODULES],
  providers: [FireblocksCwRegistryService],
  exports: [
    FireblocksCoreModule,
    FireblocksCwRegistryService,
    ...ADMIN_MODULES,
    ...NON_ADMIN_MODULES,
  ],
})
export class FireblocksCwRegistryModule {}
