import { ApiProperty } from '@nestjs/swagger';

export class SwapTransaction {
	@ApiProperty({
		type: () => Number,
		nullable: false,
	})
	fee: number;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	dex: string;

	@ApiProperty({
		type: () => Number,
		nullable: false,
	})
	amountOut: number;

	@ApiProperty({
		type: () => Number,
		nullable: false,
	})
	amountIn: number;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	toToken: string;

	@ApiProperty({
		type: () => Number,
		nullable: false,
	})
	wallet: number;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	fromToken: string;

	@ApiProperty({
		type: String,
	})
	id: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
