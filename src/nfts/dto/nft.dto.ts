import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NftDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	id: string;
}
