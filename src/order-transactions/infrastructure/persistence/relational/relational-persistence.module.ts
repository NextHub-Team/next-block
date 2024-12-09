import { Module } from '@nestjs/common';
import { OrderTransactionRepository } from '../order-transaction.repository';
import { OrderTransactionRelationalRepository } from './repositories/order-transaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTransactionEntity } from './entities/order-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderTransactionEntity])],
  providers: [
    {
      provide: OrderTransactionRepository,
      useClass: OrderTransactionRelationalRepository,
    },
  ],
  exports: [OrderTransactionRepository],
})
export class RelationalOrderTransactionPersistenceModule {}
