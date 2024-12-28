import { NftTransaction } from '../../nft-transactions/domain/nft-transaction';
import { Wallet } from '../../wallets/domain/wallet';
import { ApiProperty } from '@nestjs/swagger';

export class Nft {
	@ApiProperty({
		type: () => String,
		nullable: true,
	})
	attributes?: string | null;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	OwnerAddress: string;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	name: string;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	objectUri: string;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	metadataUri: string;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	contractAddress: string;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	blockchain: string;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	token: string;

	@ApiProperty({
		type: () => [NftTransaction],
		nullable: true,
	})
	nftTransactions?: NftTransaction[] | null;

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
