import { ApiProperty } from '@nestjs/swagger';

export class TransferTransaction {
  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  fromAddress: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  toAddress: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  fee: number;

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
  transactionHash: string;

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
