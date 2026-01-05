import { Module } from '@nestjs/common';
import { SleevesTransactionRepository } from '../sleeves-transaction.repository';
import { SleevesTransactionRelationalRepository } from './repositories/sleeves-transaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SleevesTransactionEntity } from './entities/sleeves-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SleevesTransactionEntity])],
  providers: [
    {
      provide: SleevesTransactionRepository,
      useClass: SleevesTransactionRelationalRepository,
    },
  ],
  exports: [SleevesTransactionRepository],
})
export class RelationalSleevesTransactionPersistenceModule {}
