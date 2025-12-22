import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { FireblocksCwWalletsService } from './fireblocks-cw-wallets.service';
import { FireblocksCwWalletsController } from './fireblocks-cw-wallets.controller';
import { RelationalFireblocksCwWalletPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

// TODO: 1) Update entity to keep only wallet address and info
// TODO: 2) Add relation with account (needs review)
// TODO: 3) Save wallet to DB after Fireblocks creation; recover if needed

@Module({
  imports: [
    // do not remove this comment
    RelationalFireblocksCwWalletPersistenceModule,
  ],
  controllers: [FireblocksCwWalletsController],
  providers: [FireblocksCwWalletsService],
  exports: [
    FireblocksCwWalletsService,
    RelationalFireblocksCwWalletPersistenceModule,
  ],
})
export class FireblocksCwWalletsModule {}
