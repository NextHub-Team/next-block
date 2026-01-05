import { SleevesModule } from '../sleeves/sleeves.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { SleevesTransactionsService } from './sleeves-transactions.service';
import { SleevesTransactionsController } from './sleeves-transactions.controller';
import { RelationalSleevesTransactionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
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
