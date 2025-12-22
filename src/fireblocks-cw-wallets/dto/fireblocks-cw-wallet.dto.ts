import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FireblocksCwWalletAsset } from '../types/fireblocks-cw-wallet.type';

export class FireblocksCwWalletDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  vaultType: string;

  @ApiProperty()
  @IsBoolean()
  autoFuel: boolean;

  @ApiProperty()
  @IsBoolean()
  hiddenOnUI: boolean;

  @ApiProperty()
  @IsString()
  customerRefId: string;

  @ApiPropertyOptional({
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

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
