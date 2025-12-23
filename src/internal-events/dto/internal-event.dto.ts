import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InternalEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
