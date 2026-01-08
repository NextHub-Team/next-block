import { FireblocksCwWallet } from '../../fireblocks-cw-wallets/domain/fireblocks-cw-wallet';
import { Sleeves } from '../../sleeves/domain/sleeves';
import { ApiProperty } from '@nestjs/swagger';
import {
  SleevesTransactionPointType,
  SleevesTransactionType,
} from '../types/sleeves-transaction-enum.type';

export class SleevesTransaction {
  @ApiProperty({
    type: () => FireblocksCwWallet,
    nullable: false,
  })
  wallet: FireblocksCwWallet;

  @ApiProperty({
    enum: SleevesTransactionType,
    default: SleevesTransactionType.TRANSFER_IN,
    nullable: false,
  })
  type?: SleevesTransactionType = SleevesTransactionType.TRANSFER_IN;

  @ApiProperty({
    enum: SleevesTransactionPointType,
    default: SleevesTransactionPointType.REWARD,
    nullable: false,
  })
  pointType: SleevesTransactionPointType = SleevesTransactionPointType.REWARD;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  txHash: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  pointCount: number;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  blockNumber?: number | null;

  @ApiProperty({
    type: () => Sleeves,
    nullable: false,
  })
  sleeve: Sleeves;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
