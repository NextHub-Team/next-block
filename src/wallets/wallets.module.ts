import { MainWalletsModule } from '../main-wallets/main-wallets.module';
import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { RelationalWalletPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    MainWalletsModule,

    // import modules, etc.
    RelationalWalletPersistenceModule,
  ],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService, RelationalWalletPersistenceModule],
})
export class WalletsModule {}
