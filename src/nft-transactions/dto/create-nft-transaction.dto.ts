import { NftDto } from '../../nfts/dto/nft.dto';

import {
  // decorators here

  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateNftTransactionDto {
  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  gasFee?: number | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  transactionHash: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  toAddress: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  fromAddress: string;

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
    type: () => Number,
  })
  @IsNumber()
  wallet: number;

  nft?: NftDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
