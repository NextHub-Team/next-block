import { Wallet } from '../../wallets/domain/wallet';
import { ApiProperty } from '@nestjs/swagger';

export class Transaction {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  details: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  asset: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  priority: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  status: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  type: string;

  @ApiProperty({
    type: () => Wallet,
    nullable: false,
  })
  wallet: Wallet;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
