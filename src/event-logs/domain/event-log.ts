import { UserLog } from '../../user-logs/domain/user-log';
import { ApiProperty } from '@nestjs/swagger';
import { EventLogStatusEnum } from '../types/event-logs.enum';

export class EventLog {
	@ApiProperty({
		type: () => String,
		nullable: false,
		enum: EventLogStatusEnum,
		default: EventLogStatusEnum.Pending,
	})
	status?: string = EventLogStatusEnum.Pending;

	@ApiProperty({
		type: () => Boolean,
		nullable: false,
	})
	processed?: boolean;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	newValue: string;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	oldValue: string;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	property: string;

	@ApiProperty({
		type: () => String,
		nullable: false,
	})
	entity: string;

	@ApiProperty({
		type: () => UserLog,
		nullable: false,
	})
	userLog: UserLog;

	@ApiProperty({
		type: String,
	})
	id: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
