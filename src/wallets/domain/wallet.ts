import { TransactionLog } from '../../transaction-logs/domain/transaction-log';
import { Nft } from '../../nfts/domain/nft';
import { MainWallet } from '../../main-wallets/domain/main-wallet';
import { ApiProperty } from '@nestjs/swagger';

export class Wallet {
	@ApiProperty({
		type: () => String,
		nullable: true,
	})
	details?: string | null;

	@ApiProperty({
		type: () => [TransactionLog],
		nullable: true,
	})
	transactionLog?: TransactionLog[] | null;

	@ApiProperty({
		type: () => [Nft],
		nullable: true,
	})
	nfts?: Nft[] | null;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	legacyAddress: string;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	blockchain: string;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	address: string;

	@ApiProperty({
		type: () => MainWallet,
		nullable: false,
	})
	mainWallet: MainWallet;

	@ApiProperty({
		type: String,
	})
	id: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
