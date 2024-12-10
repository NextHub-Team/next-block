import { NftTransactionsModule } from '../nft-transactions/nft-transactions.module';
import { WalletsModule } from '../wallets/wallets.module';
import { forwardRef, Module } from '@nestjs/common';
import { NftsService } from './nfts.service';
import { NftsController } from './nfts.controller';
import { RelationalNftPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    forwardRef(() => NftTransactionsModule),
    forwardRef(() => WalletsModule),
    // import modules, etc.
    RelationalNftPersistenceModule,
  ],
  controllers: [NftsController],
  providers: [NftsService],
  exports: [NftsService, RelationalNftPersistenceModule],
})
export class NftsModule { }
