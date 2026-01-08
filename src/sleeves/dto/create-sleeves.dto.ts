import { AssetRegistryDto } from '../../asset-registries/dto/asset-registry.dto';

import {
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import { Type } from 'class-transformer';

export class CreateSleevesDto {
  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  ContractName: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  contractAddress: string;

  @ApiProperty({
    required: true,
    type: () => AssetRegistryDto,
  })
  @ValidateNested()
  @Type(() => AssetRegistryDto)
  @IsNotEmptyObject()
  asset: AssetRegistryDto;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  tag?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  sleeveId: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
