import { NftsModule } from '../nfts/nfts.module';
import { forwardRef, Module } from '@nestjs/common';
import { NftTransactionsService } from './nft-transactions.service';
import { NftTransactionsController } from './nft-transactions.controller';
import { RelationalNftTransactionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
	imports: [
		forwardRef(() => NftsModule),
		// import modules, etc.
		RelationalNftTransactionPersistenceModule,
	],
	controllers: [NftTransactionsController],
	providers: [NftTransactionsService],
	exports: [NftTransactionsService, RelationalNftTransactionPersistenceModule],
})
export class NftTransactionsModule {}
