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
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsString()
  details: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  asset: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  priority: string;

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
    type: () => WalletDto,
  })
  @ValidateNested()
  @Type(() => WalletDto)
  @IsNotEmptyObject()
  wallet: WalletDto;
  // Don't forget to use the class-validator decorators in the DTO properties.
}
