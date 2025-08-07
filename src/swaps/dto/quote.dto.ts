import { IsString, IsEthereumAddress, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SwapQuoteDto {
  @ApiProperty({
    example: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    description: 'Token to sell (address)',
  })
  @IsEthereumAddress()
  sellToken: string;

  @ApiProperty({
    example: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    description: 'Token to buy (address)',
  })
  @IsEthereumAddress()
  buyToken: string;

  @ApiProperty({
    example: '1000000',
    description:
      'Amount of token to sell in base units (e.g. 6 decimals for USDC)',
  })
  @IsString()
  sellAmount: string;

  @ApiProperty({
    example: 137,
    description: 'ID of the chain (e.g., 137 for Polygon)',
  })
  @IsNumber()
  @Type(() => Number)
  chainId: number;

  @ApiProperty({
    example: '0x11111112542d85b3ef69ae05771c2dccff4faa26',
    description: 'Wallet address initiating the swap',
  })
  @IsEthereumAddress()
  taker: string;
}
