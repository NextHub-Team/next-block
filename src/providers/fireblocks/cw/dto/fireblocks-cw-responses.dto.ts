import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { FireblocksEnvironmentType } from '../types/fireblocks-enum.type';
import {
  FireblocksAssetMetadataDto,
  FireblocksDepositAddressDto,
  FireblocksVaultAccountDto,
  FireblocksVaultAssetDto,
} from './fireblocks-cw-base.dto';

export {
  FireblocksAssetMetadataDto,
  FireblocksBlockchainDto,
  FireblocksCustodialWalletDto,
  FireblocksDepositAddressDto,
  FireblocksUserPortfolioDto,
  FireblocksVaultAccountDto,
  FireblocksVaultAccountWalletDto,
  FireblocksVaultAssetDto,
} from './fireblocks-cw-base.dto';

// ---------------------------------------------------------------------------
// Configuration DTOs
// ---------------------------------------------------------------------------
@Exclude()
export class FireblocksRateLimitDto {
  @ApiProperty({
    description: 'The number of tokens available per rate limit interval',
    example: 50,
  })
  @Expose()
  @IsInt()
  @Type(() => Number)
  tokensPerInterval!: number;

  @ApiProperty({
    description: 'Interval duration for the rate limit (milliseconds)',
    example: 60000,
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
    example: 10,
  })
  @Expose()
  @IsInt()
  @Min(1)
  failureThreshold!: number;

  @ApiProperty({
    description: 'Cooldown window before the circuit breaker is reset (ms)',
    example: 60000,
  })
  @Expose()
  @IsInt()
  @Type(() => Number)
  resetTimeoutMs!: number;

  @ApiProperty({
    description:
      'Number of successful samples required to half-open the breaker',
    example: 3,
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
    example: 'custody-user',
  })
  @Expose()
  @IsString()
  vaultNamePrefix!: string;

  @ApiProperty({
    description: 'Request timeout used by the Fireblocks SDK (ms)',
    example: 60000,
  })
  @Expose()
  @IsInt()
  requestTimeoutMs!: number;

  @ApiProperty({
    description: 'Max SDK retries per request',
    example: 5,
  })
  @Expose()
  @IsInt()
  maxRetries!: number;

  @ApiProperty({
    description: 'Whether extra SDK debug logging is enabled',
    example: true,
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
export class FireblocksBulkVaultAccountJobDto {
  @ApiProperty({
    description: 'Fireblocks job id for the bulk vault account creation task',
    example: '3f0e8aaf-2b90-4b74-a2d1-0f234a6e2bd3',
  })
  @Expose()
  @IsString()
  jobId!: string;

  @ApiProperty({
    description: 'Number of vault accounts requested',
    example: 3,
  })
  @Expose()
  @IsInt()
  requested!: number;

  @ApiProperty({
    description: 'Vault account names submitted to Fireblocks',
    example: [
      'user:8f6c2a10-8a4b-4c3e-9f2a-1234567890ab',
      'user:9b7d3c21-1f5e-4a6b-8c4d-abcdef123456',
    ],
    type: [String],
  })
  @Expose()
  @IsArray()
  @IsString({ each: true })
  names!: string[];

  @ApiProperty({
    description: 'Base asset ids to activate on each new vault account',
    example: ['USDC_POLYGON'],
    type: [String],
  })
  @Expose()
  @IsArray()
  @IsString({ each: true })
  baseAssetIds!: string[];

  @ApiPropertyOptional({
    description:
      'Vault account names that were skipped because they already exist',
    example: ['user:8f6c2a10-8a4b-4c3e-9f2a-1234567890ab'],
    type: [String],
  })
  @Expose()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  existingVaultNames?: string[];
}

@Exclude()
export class FireblocksBulkVaultAccountsSyncDto {
  @ApiProperty({
    description: 'Vault accounts that were found and synced locally',
    type: () => [FireblocksVaultAccountDto],
  })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => FireblocksVaultAccountDto)
  accounts!: FireblocksVaultAccountDto[];

  @ApiProperty({
    description: 'Vault account ids that could not be found in Fireblocks',
    example: ['missing-id-1', 'missing-id-2'],
    type: [String],
  })
  @Expose()
  @IsArray()
  @IsString({ each: true })
  missingIds!: string[];
}

// ---------------------------------------------------------------------------
// Aggregated responses
// ---------------------------------------------------------------------------
@Exclude()
export class FireblocksVaultAccountsPageDto {
  @ApiPropertyOptional({
    description: 'Vault accounts in this page',
    type: () => [FireblocksVaultAccountDto],
  })
  @Expose()
  @Type(() => FireblocksVaultAccountDto)
  accounts?: FireblocksVaultAccountDto[];

  @ApiPropertyOptional({ description: 'Paging cursor (next url)' })
  @Expose()
  nextUrl?: string;

  @ApiPropertyOptional({ description: 'Paging cursor (previous url)' })
  @Expose()
  previousUrl?: string;
}

@Exclude()
export class FireblocksPagingDto {
  @ApiPropertyOptional({
    description:
      'Cursor to fetch the previous page (pass as ?before=... on next request)',
    example: 'cursor_prev_abc123',
  })
  @Expose()
  @IsOptional()
  @IsString()
  before?: string;

  @ApiPropertyOptional({
    description:
      'Cursor to fetch the next page (pass as ?after=... on next request)',
    example: 'cursor_next_xyz789',
  })
  @Expose()
  @IsOptional()
  @IsString()
  after?: string;
}

@Exclude()
export class FireblocksPaginatedAssetWalletResponseDto {
  @ApiPropertyOptional({
    description: 'Wallets in the page',
    type: () => [FireblocksVaultAssetDto],
  })
  @Expose()
  @Type(() => FireblocksVaultAssetDto)
  assetWallets?: FireblocksVaultAssetDto[];

  @ApiPropertyOptional({
    description: 'Paging cursors from Fireblocks',
    type: () => FireblocksPagingDto,
  })
  @Expose()
  @ValidateNested()
  @Type(() => FireblocksPagingDto)
  paging?: FireblocksPagingDto;
}

@Exclude()
export class FireblocksAssetCatalogDto {
  @ApiProperty({
    description: 'Configured Fireblocks environment',
    enum: FireblocksEnvironmentType,
  })
  @Expose()
  envType!: FireblocksEnvironmentType;

  @ApiProperty({
    description: 'Supported assets for the workspace',
    type: () => [FireblocksAssetMetadataDto],
  })
  @ValidateNested({ each: true })
  @Type(() => FireblocksAssetMetadataDto)
  @Expose()
  assets!: FireblocksAssetMetadataDto[];
}

@Exclude()
export class FireblocksSpecialAddressItemDto {
  @ApiProperty({
    description: 'Asset identifier for the created address',
    example: 'XRP',
  })
  @IsString()
  @Expose()
  assetId!: string;

  @ApiProperty({
    description: 'Created deposit address for the asset',
    type: () => FireblocksDepositAddressDto,
  })
  @ValidateNested()
  @Type(() => FireblocksDepositAddressDto)
  @Expose()
  depositAddress!: FireblocksDepositAddressDto;
}

@Exclude()
export class FireblocksSpecialAddressesResponseDto {
  @ApiProperty({
    description: 'Vault account metadata used to create the addresses',
    type: () => FireblocksVaultAccountDto,
  })
  @ValidateNested()
  @Type(() => FireblocksVaultAccountDto)
  @Expose()
  vaultAccount!: FireblocksVaultAccountDto;

  @ApiProperty({
    description: 'List of created special addresses grouped by asset',
    type: () => [FireblocksSpecialAddressItemDto],
  })
  @ValidateNested({ each: true })
  @Type(() => FireblocksSpecialAddressItemDto)
  @Expose()
  addresses!: FireblocksSpecialAddressItemDto[];
}
