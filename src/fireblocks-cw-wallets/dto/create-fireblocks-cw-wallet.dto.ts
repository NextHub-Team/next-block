import {
  // decorators here
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';
import { FireblocksCwWalletAsset } from '../types/fireblocks-cw-wallet.type';
import { Type } from 'class-transformer';

export class CreateFireblocksCwWalletDto {
  @ApiProperty({
    required: false,
    type: () => [FireblocksCwWalletAsset],
    example: [
      {
        id: 'ETH',
        status: 'READY',
        address: '0x8f3C9d1a3bC4F5eA2cC9F9b0E1D5A6b7C8D9E0F1',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FireblocksCwWalletAsset)
  assets?: FireblocksCwWalletAsset[] | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  vaultType?: string;

  @ApiProperty({
    required: false,
    type: () => Boolean,
  })
  @IsOptional()
  @IsBoolean()
  autoFuel?: boolean;

  @ApiProperty({
    required: false,
    type: () => Boolean,
  })
  @IsOptional()
  @IsBoolean()
  hiddenOnUI?: boolean;

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
  customerRefId: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
