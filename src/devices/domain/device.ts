import { Notification } from '../../notifications/domain/notification';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Device {
	@ApiProperty({
		type: () => [Notification],
		nullable: true,
	})
	notifications?: Notification[] | null;

	@ApiProperty({
		type: () => String,
		nullable: true,
	})
	name?: string | null;

	@ApiProperty({
		type: () => String,
		nullable: true,
	})
	physicalId?: string | null;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	type: string;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	token?: string;

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
