import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EventLogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}