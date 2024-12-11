import {
  // decorators here
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateOrderTransactionDto {
  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  type: string;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  fee: number;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string | null;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  totalValue: number;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  cryptoAmount: number;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  currencyAmount?: number | null;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  wallet: number;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
