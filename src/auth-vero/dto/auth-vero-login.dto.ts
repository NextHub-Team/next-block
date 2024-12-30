import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthVeroLoginDto {
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  veroToken: string;
}
