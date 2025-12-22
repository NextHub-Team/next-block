import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FireblocksCwWalletAsset {
  @ApiProperty({ description: 'Asset identifier', example: 'ETH' })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Provisioning status of the asset',
    example: 'READY',
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Deposit address for the asset',
    example: '0x8f3C9d1a3bC4F5eA2cC9F9b0E1D5A6b7C8D9E0F1',
  })
  @IsString()
  address: string;
}
