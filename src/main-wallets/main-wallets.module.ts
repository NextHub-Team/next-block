import { Module } from '@nestjs/common';
import { MainWalletsService } from './main-wallets.service';
import { MainWalletsController } from './main-wallets.controller';
import { RelationalMainWalletPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalMainWalletPersistenceModule,
  ],
  controllers: [MainWalletsController],
  providers: [MainWalletsService],
  exports: [MainWalletsService, RelationalMainWalletPersistenceModule],
})
export class MainWalletsModule {}
