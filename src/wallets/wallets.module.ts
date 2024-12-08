import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { RelationalWalletPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalWalletPersistenceModule,
  ],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService, RelationalWalletPersistenceModule],
})
export class WalletsModule {}
