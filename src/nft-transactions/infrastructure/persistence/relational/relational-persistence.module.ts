import { Module } from '@nestjs/common';
import { NftTransactionRepository } from '../nft-transaction.repository';
import { NftTransactionRelationalRepository } from './repositories/nft-transaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftTransactionEntity } from './entities/nft-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NftTransactionEntity])],
  providers: [
    {
      provide: NftTransactionRepository,
      useClass: NftTransactionRelationalRepository,
    },
  ],
  exports: [NftTransactionRepository],
})
export class RelationalNftTransactionPersistenceModule {}
