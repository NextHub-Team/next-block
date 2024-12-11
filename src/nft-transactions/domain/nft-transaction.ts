import { Nft } from '../../nfts/domain/nft';
import { ApiProperty } from '@nestjs/swagger';

export class NftTransaction {
  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  gasFee?: number | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  transactionHash: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  toAddress: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  fromAddress: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  contractAddress: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  blockchain: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  wallet: number;

  @ApiProperty({
    type: () => Nft,
    nullable: false,
  })
  nft?: Nft;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
