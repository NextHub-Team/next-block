import { Module } from '@nestjs/common';
import { OrderTransactionsService } from './order-transactions.service';
import { OrderTransactionsController } from './order-transactions.controller';
import { RelationalOrderTransactionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalOrderTransactionPersistenceModule,
  ],
  controllers: [OrderTransactionsController],
  providers: [OrderTransactionsService],
  exports: [
    OrderTransactionsService,
    RelationalOrderTransactionPersistenceModule,
  ],
})
export class OrderTransactionsModule {}