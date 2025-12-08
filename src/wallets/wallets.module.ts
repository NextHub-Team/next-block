import { UsersModule } from '../users/users.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { RelationalWalletPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import {
  WALLET_PROVIDER_ADAPTERS,
  WalletProviderFactory,
} from './provider-registry/wallet-provider.factory';

@Module({
  imports: [
    UsersModule,

    // do not remove this comment
    RelationalWalletPersistenceModule,
  ],
  controllers: [WalletsController],
  providers: [
    WalletsService,
    WalletProviderFactory,
    { provide: WALLET_PROVIDER_ADAPTERS, useValue: [] },
  ],
  exports: [
    WalletsService,
    RelationalWalletPersistenceModule,
    WalletProviderFactory,
    WALLET_PROVIDER_ADAPTERS,
  ],
})
export class WalletsModule {}
