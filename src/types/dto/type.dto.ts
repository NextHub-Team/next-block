import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TypeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
