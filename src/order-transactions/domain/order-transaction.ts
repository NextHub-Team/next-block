import { ApiProperty } from '@nestjs/swagger';

export class OrderTransaction {
	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	type: string;

	@ApiProperty({
		type: () => Number,
		nullable: false,
	})
	fee: number;

	@ApiProperty({
		type: () => String,
		nullable: true,
	})
	paymentMethod?: string | null;

	@ApiProperty({
		type: () => Number,
		nullable: false,
	})
	totalValue: number;

	@ApiProperty({
		type: () => Number,
		nullable: false,
	})
	price: number;

	@ApiProperty({
		type: () => Number,
		nullable: false,
	})
	cryptoAmount: number;

	@ApiProperty({
		type: () => Number,
		nullable: true,
	})
	currencyAmount?: number | null;

	@ApiProperty({
		type: () => Number,
		nullable: false,
	})
	wallet: number;

	@ApiProperty({
		type: String,
	})
	id: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
