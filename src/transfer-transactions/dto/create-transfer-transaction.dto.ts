import { IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateTransferTransactionDto {
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
  toAddress: string;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  fee: number;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  amount: number;

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
  transactionHash: string;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  wallet: number;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
