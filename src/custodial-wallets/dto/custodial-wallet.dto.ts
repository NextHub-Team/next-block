import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CustodialWalletDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
