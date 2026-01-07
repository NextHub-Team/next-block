import {
  // decorators here

  IsEnum,
  IsString,
  IsOptional,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';
import { AssetRegistryProviderName } from '../types/asset-registry-enum.type';
import { getEnumErrorMessage } from '../../utils/helpers/enum.helper';

export class CreateAssetRegistryDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    required: false,
    enum: AssetRegistryProviderName,
  })
  @IsOptional()
  @IsEnum(AssetRegistryProviderName, {
    message: getEnumErrorMessage(AssetRegistryProviderName, 'Provider name'),
  })
  providerName?: AssetRegistryProviderName | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  envType?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  chainName: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  assetId: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
