import { Injectable, Type } from '@nestjs/common';
import { AdminVaultModule } from './admin/modules/admin-vault.module';
import { AdminWithdrawalsModule } from './admin/modules/admin-withdrawals.module';
import { CwVaultModule } from './modules/cw-vault.module';
import { CwTransactionsModule } from './modules/cw-transactions.module';

const ADMIN_MODULES: Array<Type> = [AdminWithdrawalsModule, AdminVaultModule];

const NON_ADMIN_MODULES: Array<Type> = [CwVaultModule, CwTransactionsModule];

@Injectable()
export class FireblocksCwRegistryService {
  getAdminModules(): Array<Type> {
    return [...ADMIN_MODULES];
  }

  getNonAdminModules(): Array<Type> {
    return [...NON_ADMIN_MODULES];
  }

  getAllModules(): Array<Type> {
    return [...ADMIN_MODULES, ...NON_ADMIN_MODULES];
  }
}
