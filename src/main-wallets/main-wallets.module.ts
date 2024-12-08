import { UsersModule } from '../users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { MainWalletsService } from './main-wallets.service';
import { MainWalletsController } from './main-wallets.controller';
import { RelationalMainWalletPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { PassphrasesModule } from '../passphrases/passphrases.module';

@Module({
  imports: [
    PassphrasesModule,
    forwardRef(() => UsersModule),
    // import modules, etc.
    RelationalMainWalletPersistenceModule,
  ],
  controllers: [MainWalletsController],
  providers: [MainWalletsService],
  exports: [MainWalletsService, RelationalMainWalletPersistenceModule],
})
export class MainWalletsModule {}
