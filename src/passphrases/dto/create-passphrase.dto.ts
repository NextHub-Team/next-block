import {
	// decorators here

	IsString,
} from 'class-validator';

import {
	// decorators here
	ApiProperty,
} from '@nestjs/swagger';

export class CreatePassphraseDto {
	@ApiProperty({
		required: true,
		type: () => String,
	})
	@IsString()
	location: string;

	// Don't forget to use the class-validator decorators in the DTO properties.
}
