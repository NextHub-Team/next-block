import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class UserLog {
	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	event: string;

	@ApiProperty({
		type: Object, // Changed from String to Object
		nullable: true,
		description: 'Additional details in JSON format',
	})
	details?: Record<string, any> | null;

	@ApiProperty({
		type: () => User,
		nullable: false,
	})
	user: User;

	@ApiProperty({
		type: String,
	})
	id: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
