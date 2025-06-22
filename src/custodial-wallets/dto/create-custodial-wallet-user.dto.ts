import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustodialWalletUserDto {
  @ApiProperty({ required: true, type: () => String })
  @IsString()
  name: string;
}
