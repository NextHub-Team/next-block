import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { AccountStatus } from '../types/account-enum.type';

export class FilterAccountsDto {
  @ApiPropertyOptional({
    description: 'Filter accounts by label',
    example: 'Primary Binance Account',
    type: String,
  })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({
    description: 'Filter accounts by operational status',
    enum: AccountStatus,
    example: AccountStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @ApiPropertyOptional({
    description: 'Filter by provider-side account identifier',
    example: 'acct_1234567890',
    type: String,
  })
  @IsOptional()
  @IsString()
  accountId?: string;
}

export class FilterAccountsAdminDto extends FilterAccountsDto {
  @ApiPropertyOptional({
    description: 'Filter by user identifier',
    type: Number,
    example: 42,
  })
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsOptional()
  @IsNumber()
  userId?: number;
}
