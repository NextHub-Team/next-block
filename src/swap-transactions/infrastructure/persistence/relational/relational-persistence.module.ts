import { Module } from '@nestjs/common';
import { SwapTransactionRepository } from '../swap-transaction.repository';
import { SwapTransactionRelationalRepository } from './repositories/swap-transaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwapTransactionEntity } from './entities/swap-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SwapTransactionEntity])],
  providers: [
    {
      provide: SwapTransactionRepository,
      useClass: SwapTransactionRelationalRepository,
    },
  ],
  exports: [SwapTransactionRepository],
})
export class RelationalSwapTransactionPersistenceModule {}
