import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SupportedAssetDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
