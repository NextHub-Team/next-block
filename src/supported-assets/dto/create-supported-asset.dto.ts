import {
  // decorators here

  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateSupportedAssetDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  protocol?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  nativeAsset?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  issuerAddress?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  type: string;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  decimals?: number | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  contractAddress?: string | null;

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
  symbol: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  name: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
