import { Nft } from '../../nfts/domain/nft';
import { Transaction } from '../../transactions/domain/transaction';
import { ApiProperty } from '@nestjs/swagger';

export class NftTransaction {
  @ApiProperty({
    type: () => Nft,
    nullable: false,
  })
  nft?: Nft;

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
