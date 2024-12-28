import { WalletDto } from '../../wallets/dto/wallet.dto';

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
} from 'class-validator';

import {
	// decorators here
	ApiProperty,
} from '@nestjs/swagger';

export class CreateTransactionLogDto {
	@ApiProperty({
		required: false,
		type: () => String,
	})
	@IsOptional()
	@IsString()
	details?: string | null;

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
	status: string;

	@ApiProperty({
		required: true,
		type: () => String,
	})
	@IsString()
	type: string;

	@ApiProperty({
		required: true,
		type: () => String,
	})
	@IsString()
	assetName: string;

	@ApiProperty({
		required: true,
		type: () => WalletDto,
	})
	@ValidateNested()
	@Type(() => WalletDto)
	@IsNotEmptyObject()
	wallet: WalletDto;

	// Don't forget to use the class-validator decorators in the DTO properties.
}
