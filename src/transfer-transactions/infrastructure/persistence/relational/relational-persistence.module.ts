import { Module } from '@nestjs/common';
import { TransferTransactionRepository } from '../transfer-transaction.repository';
import { TransferTransactionRelationalRepository } from './repositories/transfer-transaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferTransactionEntity } from './entities/transfer-transaction.entity';

@Module({
	imports: [TypeOrmModule.forFeature([TransferTransactionEntity])],
	providers: [
		{
			provide: TransferTransactionRepository,
			useClass: TransferTransactionRelationalRepository,
		},
	],
	exports: [TransferTransactionRepository],
})
export class RelationalTransferTransactionPersistenceModule {}
