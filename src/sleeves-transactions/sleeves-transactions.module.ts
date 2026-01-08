import { FireblocksCwWalletsModule } from '../fireblocks-cw-wallets/fireblocks-cw-wallets.module';
import { SleevesModule } from '../sleeves/sleeves.module';
import {
  // do not remove this comment
  Module,
  forwardRef,
} from '@nestjs/common';
import { SleevesTransactionsService } from './sleeves-transactions.service';
import { SleevesTransactionsController } from './sleeves-transactions.controller';
import { RelationalSleevesTransactionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    forwardRef(() => FireblocksCwWalletsModule),

    SleevesModule,

    // do not remove this comment
    RelationalSleevesTransactionPersistenceModule,
  ],
  controllers: [SleevesTransactionsController],
  providers: [SleevesTransactionsService],
  exports: [
    SleevesTransactionsService,
    RelationalSleevesTransactionPersistenceModule,
  ],
})
export class SleevesTransactionsModule {}
