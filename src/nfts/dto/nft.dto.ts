import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NFTDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
