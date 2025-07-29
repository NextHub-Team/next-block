import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty({ example: '0xa3d370e8a4180828f6756cb8dce359cf21d9d6f7' })
  @IsString()
  to: string;

  @ApiProperty({ example: '0x123abc...' })
  @IsString()
  data: string;

  @ApiProperty({ example: '300000' })
  @IsString()
  gas: string;

  @ApiProperty({ example: '20000000000' })
  @IsString()
  gasPrice: string;

  @ApiProperty({ example: '0' })
  @IsString()
  value: string;
}
