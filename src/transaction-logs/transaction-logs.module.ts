import { WalletsModule } from '../wallets/wallets.module';
import { forwardRef, Module } from '@nestjs/common';
import { TransactionLogsService } from './transaction-logs.service';
import { TransactionLogsController } from './transaction-logs.controller';
import { RelationalTransactionLogPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
	imports: [
		forwardRef(() => WalletsModule),
		// import modules, etc.
		RelationalTransactionLogPersistenceModule,
	],
	controllers: [TransactionLogsController],
	providers: [TransactionLogsService],
	exports: [TransactionLogsService, RelationalTransactionLogPersistenceModule],
})
export class TransactionLogsModule {}
