import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from './fireblocks-core.module';
import { FireblocksCwRegistryService } from './fireblocks-cw-registry.service';
import { AdminVaultModule } from './admin/modules/admin-vault.module';
import { AdminWithdrawalsModule } from './admin/modules/admin-withdrawals.module';
import { CwVaultModule } from './modules/cw-vault.module';
import { CwTransactionsModule } from './modules/cw-transactions.module';

const ADMIN_MODULES = [AdminWithdrawalsModule, AdminVaultModule];

const NON_ADMIN_MODULES = [CwVaultModule, CwTransactionsModule];

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
