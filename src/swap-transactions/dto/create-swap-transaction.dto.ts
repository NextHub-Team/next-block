import {
  // decorators here

  IsString,
  IsNumber,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateSwapTransactionDto {
  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  fee: number;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  dex: string;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  amountOut: number;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  amountIn: number;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  toToken: string;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  wallet: number;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  fromToken: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}