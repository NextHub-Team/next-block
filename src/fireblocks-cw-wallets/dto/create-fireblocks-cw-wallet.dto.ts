import { SleevesTransactionDto } from '../../sleeves-transactions/dto/sleeves-transaction.dto';

import { AccountDto } from '../../accounts/dto/account.dto';

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

import { Type } from 'class-transformer';

export class CreateFireblocksCwWalletDto {
  sleevesTransactions?: SleevesTransactionDto[] | null;

  @ApiProperty({
    required: true,
    type: () => AccountDto,
  })
  @ValidateNested()
  @Type(() => AccountDto)
  @IsNotEmptyObject()
  account: AccountDto;

  @ApiProperty({
    required: true,
    type: String,
    example: 'AVAXTEST',
  })
  @IsString()
  assetId: string;

  @ApiProperty({
    required: true,
    type: String,
    example: '0x8f3C9d1a3bC4F5eA2cC9F9b0E1D5A6b7C8D9E0F1',
  })
  @IsString()
  address: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
