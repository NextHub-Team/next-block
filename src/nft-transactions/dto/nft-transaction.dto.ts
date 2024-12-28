import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NftTransactionDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	id: string;
}
