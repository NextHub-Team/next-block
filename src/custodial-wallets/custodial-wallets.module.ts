import { UsersModule } from '../users/users.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { CustodialWalletsService } from './custodial-wallets.service';
import { CustodialWalletsController } from './custodial-wallets.controller';
import { RelationalCustodialWalletPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    UsersModule,

    // do not remove this comment
    RelationalCustodialWalletPersistenceModule,
  ],
  controllers: [CustodialWalletsController],
  providers: [CustodialWalletsService],
  exports: [
    CustodialWalletsService,
    RelationalCustodialWalletPersistenceModule,
  ],
})
export class CustodialWalletsModule {}
