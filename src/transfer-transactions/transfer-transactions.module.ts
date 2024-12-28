import { Module } from '@nestjs/common';
import { TransferTransactionsService } from './transfer-transactions.service';
import { TransferTransactionsController } from './transfer-transactions.controller';
import { RelationalTransferTransactionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
	imports: [
		// import modules, etc.
		RelationalTransferTransactionPersistenceModule,
	],
	controllers: [TransferTransactionsController],
	providers: [TransferTransactionsService],
	exports: [
		TransferTransactionsService,
		RelationalTransferTransactionPersistenceModule,
	],
})
export class TransferTransactionsModule {}
