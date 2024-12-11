import { Module } from '@nestjs/common';
import { TransactionLogRepository } from '../transaction-log.repository';
import { TransactionLogRelationalRepository } from './repositories/transaction-log.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionLogEntity } from './entities/transaction-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionLogEntity])],
  providers: [
    {
      provide: TransactionLogRepository,
      useClass: TransactionLogRelationalRepository,
    },
  ],
  exports: [TransactionLogRepository],
})
export class RelationalTransactionLogPersistenceModule {}
