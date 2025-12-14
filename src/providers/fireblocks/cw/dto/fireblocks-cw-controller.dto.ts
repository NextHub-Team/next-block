import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { FireblocksEnvironmentType } from '../types/fireblocks-enum.type';
import { EnsureVaultWalletOptionsDto } from './fireblocks-vault-requests.dto';

@Exclude()
export class FireblocksRateLimitDto {
  @ApiProperty({
    description: 'The number of tokens available per rate limit interval',
    example: 10,
  })
  @Expose()
  @IsInt()
  @Type(() => Number)
  tokensPerInterval!: number;

  @ApiProperty({
    description: 'Interval duration for the rate limit (milliseconds)',
    example: 1000,
  })
  @Expose()
  @IsInt()
  @Type(() => Number)
  intervalMs!: number;
}

@Exclude()
export class FireblocksCircuitBreakerDto {
  @ApiProperty({
    description: 'Failure threshold before triggering the circuit breaker',
    example: 5,
  })
  @Expose()
  @IsInt()
  @Min(1)
  failureThreshold!: number;

  @ApiProperty({
    description: 'Cooldown window before the circuit breaker is reset (ms)',
    example: 30000,
  })
  @Expose()
  @IsInt()
  @Type(() => Number)
  resetTimeoutMs!: number;

  @ApiProperty({
    description:
      'Number of successful samples required to half-open the breaker',
    example: 1,
  })
  @Expose()
  @IsInt()
  @Type(() => Number)
  halfOpenSample!: number;
}

@Exclude()
export class FireblocksCwStatusDto {
  @ApiProperty({
    description: 'Configured Fireblocks environment',
    enum: FireblocksEnvironmentType,
  })
  @Expose()
  envType!: FireblocksEnvironmentType;

  @ApiProperty({
    description: 'Prefix used when deriving vault account names',
    example: 'user',
  })
  @Expose()
  @IsString()
  vaultNamePrefix!: string;

  @ApiProperty({
    description: 'Request timeout used by the Fireblocks SDK (ms)',
    example: 30000,
  })
  @Expose()
  @IsInt()
  requestTimeoutMs!: number;

  @ApiProperty({
    description: 'Max SDK retries per request',
    example: 3,
  })
  @Expose()
  @IsInt()
  maxRetries!: number;

  @ApiProperty({
    description: 'Whether extra SDK debug logging is enabled',
    example: false,
  })
  @Expose()
  @IsBoolean()
  debugLogging!: boolean;

  @ApiProperty({
    description: 'Current rate limit configuration',
    type: () => FireblocksRateLimitDto,
  })
  @Expose()
  @ValidateNested()
  @Type(() => FireblocksRateLimitDto)
  rateLimit!: FireblocksRateLimitDto;

  @ApiProperty({
    description: 'Current circuit breaker configuration',
    type: () => FireblocksCircuitBreakerDto,
  })
  @Expose()
  @ValidateNested()
  @Type(() => FireblocksCircuitBreakerDto)
  circuitBreaker!: FireblocksCircuitBreakerDto;
}

@Exclude()
export class FireblocksVaultAccountsQueryDto {
  @ApiPropertyOptional({
    description: 'Maximum number of vault accounts to return',
    example: 20,
  })
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Cursor pointing to the previous page',
    example: 'prev_cursor',
  })
  @Expose()
  @IsOptional()
  @IsString()
  before?: string;

  @ApiPropertyOptional({
    description: 'Cursor pointing to the next page',
    example: 'next_cursor',
  })
  @Expose()
  @IsOptional()
  @IsString()
  after?: string;

  @ApiPropertyOptional({
    description: 'Filter vault accounts by asset id',
    example: 'USDC',
  })
  @Expose()
  @IsOptional()
  @IsString()
  assetId?: string;

  @ApiPropertyOptional({
    description: 'Filter vault accounts by name prefix or customer id',
    example: 'user-',
  })
  @Expose()
  @IsOptional()
  @IsString()
  namePrefix?: string;
}

@Exclude()
export class FireblocksAssetWalletsQueryDto {
  @ApiPropertyOptional({
    description: 'Maximum number of asset wallets to return',
    example: 20,
  })
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Cursor pointing to the previous page',
    example: 'prev_cursor',
  })
  @Expose()
  @IsOptional()
  @IsString()
  before?: string;

  @ApiPropertyOptional({
    description: 'Cursor pointing to the next page',
    example: 'next_cursor',
  })
  @Expose()
  @IsOptional()
  @IsString()
  after?: string;

  @ApiPropertyOptional({
    description: 'Filter asset wallets by asset id',
    example: 'BTC',
  })
  @Expose()
  @IsOptional()
  @IsString()
  assetId?: string;
}

@Exclude()
export class FireblocksEnsureUserWalletDto {
  @ApiProperty({ description: 'The asset id that should exist on the vault' })
  @Expose()
  @IsString()
  assetId!: string;

  @ApiPropertyOptional({
    description: 'Optional provider identifier override',
    example: 'provider-123',
  })
  @Expose()
  @IsOptional()
  @IsString()
  providerId?: string | null;

  @ApiPropertyOptional({
    description: 'Optional settings applied while ensuring the vault wallet',
    type: () => EnsureVaultWalletOptionsDto,
  })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => EnsureVaultWalletOptionsDto)
  options?: EnsureVaultWalletOptionsDto;
}
