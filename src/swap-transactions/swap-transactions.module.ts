import { Module } from '@nestjs/common';
import { SwapTransactionsService } from './swap-transactions.service';
import { SwapTransactionsController } from './swap-transactions.controller';
import { RelationalSwapTransactionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalSwapTransactionPersistenceModule,
  ],
  controllers: [SwapTransactionsController],
  providers: [SwapTransactionsService],
  exports: [
    SwapTransactionsService,
    RelationalSwapTransactionPersistenceModule,
  ],
})
export class SwapTransactionsModule {}
