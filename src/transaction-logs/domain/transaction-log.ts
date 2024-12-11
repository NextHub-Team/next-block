import { Wallet } from '../../wallets/domain/wallet';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionLog {
  @ApiProperty({
    type: () => Wallet,
    nullable: false,
  })
  wallet?: Wallet;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
