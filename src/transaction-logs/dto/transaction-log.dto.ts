import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TransactionLogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
