import { ApiProperty } from '@nestjs/swagger';

export class Passphrase {
	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	location: string;

	@ApiProperty({
		type: String,
	})
	id: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
