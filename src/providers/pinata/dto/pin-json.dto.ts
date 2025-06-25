import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class PinJsonDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  jsonObject: Record<string, any>;
}
