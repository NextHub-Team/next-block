import { Account } from '../../accounts/domain/account';
import { ApiProperty } from '@nestjs/swagger';
import { FireblocksCwWalletAsset } from '../types/fireblocks-cw-wallet.type';

export class FireblocksCwWallet {
  @ApiProperty({
    type: () => Account,
    nullable: false,
  })
  account: Account;

  @ApiProperty({
    type: () => [FireblocksCwWalletAsset],
    required: false,
    example: [
      {
        id: 'ETH',
        status: 'READY',
        address: '0x8f3C9d1a3bC4F5eA2cC9F9b0E1D5A6b7C8D9E0F1',
      },
    ],
  })
  assets?: FireblocksCwWalletAsset[] | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  vaultType?: string;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  autoFuel?: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  hiddenOnUI?: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  customerRefId: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
