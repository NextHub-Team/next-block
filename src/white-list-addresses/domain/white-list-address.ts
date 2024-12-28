import { ApiProperty } from '@nestjs/swagger';

export class WhiteListAddress {
	@ApiProperty({
		type: () => String,
		nullable: true,
	})
	label?: string | null;

	@ApiProperty({
		type: () => String,
		nullable: true,
	})
	description?: string | null;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	address: string;

	@ApiProperty({
		type: String,
	})
	id: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
