import { ApiProperty } from '@nestjs/swagger';
import { AssetRegistryProviderName } from '../types/asset-registry-enum.type';

export class AssetRegistry {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    enum: AssetRegistryProviderName,
    nullable: true,
  })
  providerName?: AssetRegistryProviderName | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  envType?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  chainName: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  assetId: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
