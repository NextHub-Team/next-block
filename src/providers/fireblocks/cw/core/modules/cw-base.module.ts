import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../fireblocks-core.module';
import { AdminVaultModule } from '../admin/modules/admin-vault.module';
import { AdminDestinationsModule } from '../admin/modules/admin-destinations.module';
import { AdminGasOperationsModule } from '../admin/modules/admin-gas-operations.module';
import { AdminSecurityModule } from '../admin/modules/admin-security.module';
import { AdminWithdrawalsModule } from '../admin/modules/admin-withdrawals.module';
import { CwVaultModule } from './cw-vault.module';
import { CwTransactionsModule } from './cw-transactions.module';
import { CwAdminService } from '../base/cw-admin.service';
import { CwClientService } from '../base/cw-client.service';

@Module({
  imports: [
    FireblocksCoreModule,
    AdminSecurityModule,
    AdminDestinationsModule,
    AdminWithdrawalsModule,
    AdminGasOperationsModule,
    AdminVaultModule,
    CwVaultModule,
    CwTransactionsModule,
  ],
  providers: [CwAdminService, CwClientService],
  exports: [CwAdminService, CwClientService],
})
export class CwBaseModule {}
