import { ApiProperty } from '@nestjs/swagger';

export class TransferTransaction {
  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  from_address: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  to_address: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  transaction_fee: number;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  amount: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  blockchain: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  transaction_hash: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  wallet: number;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
