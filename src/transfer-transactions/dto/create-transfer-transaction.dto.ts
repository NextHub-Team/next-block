import { TransactionDto } from '../../transactions/dto/transaction.dto';

import {
  // decorators here

  IsNumber,
  IsString,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateTransferTransactionDto {
  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  from_address: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  to_address: string;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  transaction_fee: number;

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
  transaction_hash: string;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  wallet: number;

  transaction?: TransactionDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
