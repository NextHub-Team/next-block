import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllAccountsDto {
  @ApiPropertyOptional({
    description: 'Page number starting from 1',
    type: Number,
    default: 1,
    minimum: 1,
  })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of accounts per page (max 50)',
    type: Number,
    default: 10,
    maximum: 50,
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number;
}
