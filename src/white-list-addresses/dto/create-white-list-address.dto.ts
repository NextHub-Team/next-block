import {
	// decorators here

	IsString,
	IsOptional,
} from 'class-validator';

import {
	// decorators here
	ApiProperty,
} from '@nestjs/swagger';

export class CreateWhiteListAddressDto {
	@ApiProperty({
		required: false,
		type: () => String,
	})
	@IsOptional()
	@IsString()
	label?: string | null;

	@ApiProperty({
		required: false,
		type: () => String,
	})
	@IsOptional()
	@IsString()
	description?: string | null;

	@ApiProperty({
		required: true,
		type: () => String,
	})
	@IsString()
	address: string;

	// Don't forget to use the class-validator decorators in the DTO properties.
}
