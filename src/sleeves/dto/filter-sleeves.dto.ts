import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Sleeves } from '../domain/sleeves';

export class FilterSleevesDto {
  @ApiPropertyOptional({
    description: 'name of contract',
    example: 'my contract',
    type: String,
  })
  @IsOptional()
  contractName?: Sleeves['contractName'];
  @ApiPropertyOptional({
    description: 'custom tag for search',
    example: 'custom tag',
    type: String,
  })
  @IsOptional()
  tag?: Sleeves['tag'];
  @ApiPropertyOptional({
    description: 'custom name for a sleeve',
    example: 'my sleeve',
    type: String,
  })
  @IsOptional()
  name?: Sleeves['name'];
}
