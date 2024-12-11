import { NftTransactionDto } from '../../nft-transactions/dto/nft-transaction.dto';

import { WalletDto } from '../../wallets/dto/wallet.dto';

import {
  // decorators here
  IsString,
  IsOptional,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateNftDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  attributes?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  OwnerAddress: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  objectUri: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  metadataUri: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  contractAddress: string;

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
  token: string;

  nftTransactions?: NftTransactionDto[] | null;

  wallet?: WalletDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
