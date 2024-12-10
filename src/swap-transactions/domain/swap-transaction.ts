import { Transaction } from '../../transactions/domain/transaction';
import { ApiProperty } from '@nestjs/swagger';

export class SwapTransaction {
  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  transaction_fee: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  dex: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  amount_out: number;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  amount_in: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  to_token: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  wallet: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  from_token: string;

  @ApiProperty({
    type: () => Transaction,
    nullable: false,
  })
  transaction?: Transaction;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
