import { NftDto } from '../../nfts/dto/nft.dto';

import { TransactionDto } from '../../transactions/dto/transaction.dto';

import { MainWalletDto } from '../../main-wallets/dto/main-wallet.dto';

import {
  // decorators here
  Type,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateWalletDto {
  nfts?: NftDto[] | null;

  @ApiProperty({
    required: false,
    type: () => [TransactionDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TransactionDto)
  @IsArray()
  transactions?: TransactionDto[] | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  legacyAddress: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  blockchain: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  address: string;

  @ApiProperty({
    required: true,
    type: () => MainWalletDto,
  })
  @ValidateNested()
  @Type(() => MainWalletDto)
  @IsNotEmptyObject()
  mainWallet: MainWalletDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
