import { ApiProperty } from '@nestjs/swagger';

export class SupportedAsset {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  protocol?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  nativeAsset?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  issuerAddress?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  type: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  decimals?: number | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  contractAddress?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  blockchain: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  symbol: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
