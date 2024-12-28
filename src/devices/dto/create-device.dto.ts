import { NotificationDto } from '../../notifications/dto/notification.dto';

import { UserDto } from '../../users/dto/user.dto';

import {
	// decorators here
	Type,
} from 'class-transformer';

import {
	// decorators here

	ValidateNested,
	IsNotEmptyObject,
	IsString,
	IsOptional,
	IsArray,
} from 'class-validator';

import {
	// decorators here
	ApiProperty,
} from '@nestjs/swagger';

export class CreateDeviceDto {
	@ApiProperty({
		required: false,
		type: () => [NotificationDto],
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => NotificationDto)
	@IsArray()
	notifications?: NotificationDto[] | null;

	@ApiProperty({
		required: false,
		type: () => String,
	})
	@IsOptional()
	@IsString()
	name?: string | null;

	physicalId?: string | null;

	@ApiProperty({
		required: true,
		type: () => String,
	})
	@IsString()
	type: string;

	token?: string;

	@ApiProperty({
		required: true,
		type: () => UserDto,
	})
	@ValidateNested()
	@Type(() => UserDto)
	@IsNotEmptyObject()
	user: UserDto;

	// Don't forget to use the class-validator decorators in the DTO properties.
}
