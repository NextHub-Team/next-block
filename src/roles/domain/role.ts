import { ApiProperty } from '@nestjs/swagger';

export class Role {
	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	name: string;

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
