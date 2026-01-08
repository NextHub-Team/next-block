import { SleevesTransaction } from '../../sleeves-transactions/domain/sleeves-transaction';
import { Account } from '../../accounts/domain/account';
import { ApiProperty } from '@nestjs/swagger';

export class FireblocksCwWallet {
  @ApiProperty({
    type: () => [SleevesTransaction],
    nullable: true,
  })
  SleevesTransactions?: SleevesTransaction[] | null;

  @ApiProperty({
    type: () => Account,
    nullable: false,
  })
  account: Account;

  @ApiProperty({
    type: String,
    example: 'AVAXTEST',
  })
  assetId: string;

  @ApiProperty({
    type: String,
    example: '0x8f3C9d1a3bC4F5eA2cC9F9b0E1D5A6b7C8D9E0F1',
  })
  address: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
