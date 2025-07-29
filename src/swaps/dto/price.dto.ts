import { IsString, IsNumber, IsEthereumAddress } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SwapPriceDto {
  @ApiProperty({
    example: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    description: 'Address of token to sell (e.g., USDC on Polygon)',
  })
  @IsEthereumAddress()
  sellToken: string;

  @ApiProperty({
    example: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    description: 'Address of token to buy (e.g., DAI on Polygon)',
  })
  @IsEthereumAddress()
  buyToken: string;

  @ApiProperty({
    example: '1000000',
    description: 'Sell amount in base units (e.g., 6 decimals for USDC)',
  })
  @IsString() // Still a string since API wants "number string"
  sellAmount: string;

  @ApiProperty({
    example: 137,
    description: 'Chain ID where the swap occurs (e.g., 137 for Polygon)',
  })
  @IsNumber()
  @Type(() => Number)
  chainId: number;
}
