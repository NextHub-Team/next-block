import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
