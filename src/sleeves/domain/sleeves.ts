import { AssetRegistry } from '../../asset-registries/domain/asset-registry';
import { ApiProperty } from '@nestjs/swagger';

export class Sleeves {
  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  contractName: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  contractAddress: string;

  @ApiProperty({
    type: () => AssetRegistry,
    nullable: false,
  })
  asset: AssetRegistry;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  tag?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  sleeveId: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
