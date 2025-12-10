import { Injectable, Type } from '@nestjs/common';
import { AdminAuditModule } from './modules/admin-audit.module';
import { AdminDestinationsModule } from './modules/admin-destinations.module';
import { AdminGasOperationsModule } from './modules/admin-gas-operations.module';
import { AdminSecurityModule } from './modules/admin-security.module';
import { AdminWithdrawalsModule } from './modules/admin-withdrawals.module';
import { CwDepositModule } from './modules/cw-deposit.module';
import { CwPortfolioModule } from './modules/cw-portfolio.module';
import { CwTransactionsModule } from './modules/cw-transactions.module';
import { CwTransfersModule } from './modules/cw-transfers.module';

const ADMIN_MODULES: Array<Type> = [
  AdminSecurityModule,
  AdminDestinationsModule,
  AdminWithdrawalsModule,
  AdminGasOperationsModule,
  AdminAuditModule,
];

const NON_ADMIN_MODULES: Array<Type> = [
  CwDepositModule,
  CwPortfolioModule,
  CwTransfersModule,
  CwTransactionsModule,
];

@Injectable()
export class FireblocksCwUnifiedService {
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
