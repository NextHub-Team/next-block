import { ApiProperty } from '@nestjs/swagger';

export class Permission {
	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	names: string;

	@ApiProperty({
		type: () => String,
		nullable: true,
	})
	description?: string | null;

	@ApiProperty({
		type: String,
	})
	id: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
