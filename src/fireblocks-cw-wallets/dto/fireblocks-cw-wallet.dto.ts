import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class FireblocksCwWalletDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'AVAXTEST' })
  @IsString()
  assetId: string;

  @ApiProperty({
    example: '0x8f3C9d1a3bC4F5eA2cC9F9b0E1D5A6b7C8D9E0F1',
  })
  @IsString()
  address: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
