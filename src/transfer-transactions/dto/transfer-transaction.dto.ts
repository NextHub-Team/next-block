import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TransferTransactionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
