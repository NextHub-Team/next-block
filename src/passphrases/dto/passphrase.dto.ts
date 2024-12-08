import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PassphraseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
