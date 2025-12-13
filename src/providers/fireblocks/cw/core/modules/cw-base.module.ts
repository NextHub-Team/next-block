import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../fireblocks-core.module';
import { AdminVaultModule } from '../admin/modules/admin-vault.module';
import { AdminWithdrawalsModule } from '../admin/modules/admin-withdrawals.module';
import { CwVaultModule } from './cw-vault.module';
import { CwTransactionsModule } from './cw-transactions.module';
import { CwAdminService } from '../base/cw-admin.service';
import { CwClientService } from '../base/cw-client.service';

@Module({
  imports: [
    FireblocksCoreModule,
    AdminWithdrawalsModule,
    AdminVaultModule,
    CwVaultModule,
    CwTransactionsModule,
  ],
  providers: [CwAdminService, CwClientService],
  exports: [CwAdminService, CwClientService],
})
export class CwBaseModule {}
