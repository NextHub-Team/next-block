import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SleevesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
