import { Wallet } from '../../wallets/domain/wallet';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionLog {
	@ApiProperty({
		type: () => String,
		nullable: true,
	})
	details?: string | null;

	@ApiProperty({
		type: () => String,
		nullable: true,
	})
	priority?: string | null;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	status: string;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	type: string;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	assetName: string;

	@ApiProperty({
		type: () => Wallet,
		nullable: false,
	})
	wallet?: Wallet;

	@ApiProperty({
		type: String,
	})
	id: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
