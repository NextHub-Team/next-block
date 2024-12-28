import { DeviceDto } from '../../devices/dto/device.dto';

import {
	// decorators here

	IsString,
	ValidateNested,
	IsNotEmptyObject,
	IsOptional,
	IsBoolean,
} from 'class-validator';

import {
	// decorators here
	ApiProperty,
} from '@nestjs/swagger';

import {
	// decorators here
	Type,
} from 'class-transformer';

export class CreateNotificationDto {
	@ApiProperty({
		required: false,
		type: () => String,
	})
	@IsOptional()
	@IsString()
	scheduledAt?: string | null;

	@ApiProperty({
		required: false,
		type: () => String,
	})
	@IsOptional()
	@IsString()
	sentAt?: string | null;

	@ApiProperty({
		required: false,
		type: () => Boolean,
	})
	@IsOptional()
	@IsBoolean()
	isRead?: boolean | null;

	@ApiProperty({
		required: false,
		type: () => String,
	})
	@IsOptional()
	@IsString()
	status?: string | null;

	@ApiProperty({
		required: false,
		type: () => String,
	})
	@IsOptional()
	@IsString()
	priority?: string | null;

	@ApiProperty({
		required: true,
		type: () => String,
	})
	@IsString()
	type: string;

	@ApiProperty({
		required: true,
		type: () => DeviceDto,
	})
	@ValidateNested()
	@Type(() => DeviceDto)
	@IsNotEmptyObject()
	device: DeviceDto;

	@ApiProperty({
		required: true,
		type: () => String,
	})
	@IsString()
	message: string;

	@ApiProperty({
		required: true,
		type: () => String,
	})
	@IsString()
	title: string;

	// Don't forget to use the class-validator decorators in the DTO properties.
}
