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
	IsObject,
} from 'class-validator';

import {
	// decorators here
	ApiProperty,
} from '@nestjs/swagger';

export class CreateUserLogDto {
	@ApiProperty({
		required: true,
		type: () => String,
	})
	@IsString()
	event: string;

	@ApiProperty({
		required: false,
		type: Object,
		description: 'Additional details in JSON format.',
	})
	@IsOptional()
	@IsObject()
	details?: Record<string, any> | null;

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
