import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PinFileDto {
  @ApiPropertyOptional({ example: 'my-file-name.png' })
  @IsOptional()
  @IsString()
  filename?: string;
}
