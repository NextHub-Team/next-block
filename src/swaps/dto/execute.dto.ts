import { IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';

export class ExecuteSwapDto {
  @ApiProperty({
    example: '0xefe7a854226dd49d700a881a',
    description: 'ZeroEx quote ID (zid)',
  })
  @IsString()
  zid: string;

  @ApiProperty({ example: 137, description: 'Chain ID of the network' })
  @IsNumber()
  chainId: number;

  @ApiProperty({
    type: TransactionDto,
    description: 'Transaction object from 0x response',
  })
  @ValidateNested()
  @Type(() => TransactionDto)
  transaction: TransactionDto;
}
