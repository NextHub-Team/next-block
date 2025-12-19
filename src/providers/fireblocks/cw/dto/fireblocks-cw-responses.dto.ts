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
    example: ['custody:user:123', 'custody:user:456'],
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
// Core resource DTOs
// ---------------------------------------------------------------------------
@Exclude()
export class FireblocksVaultAssetDto {
  @ApiProperty({ description: 'Asset identifier', example: 'BTC' })
  @IsString()
  @Expose()
  id!: string;

  @ApiPropertyOptional({
    description: 'Total balance',
    example: '1.75293485',
  })
  @IsOptional()
  @IsString()
  @Expose()
  total?: string;

  @ApiPropertyOptional({
    description: 'Available balance',
    example: '1.15000000',
  })
  @IsOptional()
  @IsString()
  @Expose()
  available?: string;

  @ApiPropertyOptional({
    description: 'Locked amount',
    example: '0.25000000',
  })
  @IsOptional()
  @IsString()
  @Expose()
  lockedAmount?: string;

  @ApiPropertyOptional({
    description: 'Pending balance',
    example: '0.01500000',
  })
  @IsOptional()
  @IsString()
  @Expose()
  pending?: string;

  @ApiPropertyOptional({
    description: 'Total staked',
    example: '0.02000000',
  })
  @IsOptional()
  @IsString()
  @Expose()
  totalStaked?: string;

  @ApiPropertyOptional({
    description: 'Legacy balance field',
    example: '1.75293485',
  })
  @IsOptional()
  @IsString()
  @Expose()
  balance?: string;
}

@Exclude()
export class FireblocksVaultAccountDto {
  @ApiProperty({ description: 'Vault account id', example: '123456789' })
  @IsString()
  @Expose()
  id!: string;

  @ApiProperty({
    description: 'Vault account name',
    example: 'custody-user-019a3bf6',
  })
  @IsString()
  @Expose()
  name!: string;

  @ApiPropertyOptional({
    description: 'Customer reference id',
    example: 'd13bd918-938a-4a5b-8b28-4fa3437ea5ce',
  })
  @IsOptional()
  @IsString()
  @Expose()
  customerRefId?: string;

  @ApiPropertyOptional({
    description: 'Should the account be hidden in UI',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  hiddenOnUI?: boolean;

  @ApiPropertyOptional({ description: 'Auto-fuel flag', example: true })
  @IsOptional()
  @IsBoolean()
  @Expose()
  autoFuel?: boolean;

  @ApiPropertyOptional({
    description: 'Assets configured in the vault account',
    type: () => [FireblocksVaultAssetDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FireblocksVaultAssetDto)
  @Expose()
  assets?: FireblocksVaultAssetDto[];
}

@Exclude()
export class FireblocksDepositAddressDto {
  @ApiProperty({
    description: 'Deposit address',
    example: 'bc1qxy2kgdygjrsqtzq2n0yrf1234p83kkfjhx0wlh',
  })
  @IsString()
  @Expose()
  address!: string;

  @ApiPropertyOptional({
    description: 'Memo / Tag if required',
    example: '987654321',
  })
  @IsOptional()
  @IsString()
  @Expose()
  tag?: string;

  @ApiPropertyOptional({
    description: 'Address description',
    example: 'Primary BTC deposit',
  })
  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    description: 'Customer reference id',
    example: 'd13bd918-938a-4a5b-8b28-4fa3437ea5ce',
  })
  @IsOptional()
  @IsString()
  @Expose()
  customerRefId?: string;
}

@Exclude()
export class FireblocksCustodialWalletDto {
  @ApiProperty({
    description: 'Vault account metadata',
    type: () => FireblocksVaultAccountDto,
  })
  @ValidateNested()
  @Type(() => FireblocksVaultAccountDto)
  @Expose()
  vaultAccount!: FireblocksVaultAccountDto;

  @ApiProperty({
    description: 'Vault asset metadata',
    type: () => FireblocksVaultAssetDto,
  })
  @ValidateNested()
  @Type(() => FireblocksVaultAssetDto)
  @Expose()
  vaultAsset!: FireblocksVaultAssetDto;

  @ApiProperty({
    description: 'Primary deposit address',
    type: () => FireblocksDepositAddressDto,
  })
  @ValidateNested()
  @Type(() => FireblocksDepositAddressDto)
  @Expose()
  depositAddress!: FireblocksDepositAddressDto;
}

@Exclude()
export class FireblocksVaultAccountWalletDto {
  @ApiProperty({
    description: 'Parent vault account metadata',
    type: () => FireblocksVaultAccountDto,
  })
  @ValidateNested()
  @Type(() => FireblocksVaultAccountDto)
  @Expose()
  vaultAccount!: FireblocksVaultAccountDto;

  @ApiProperty({
    description: 'Specific asset wallet information',
    type: () => FireblocksVaultAssetDto,
  })
  @ValidateNested()
  @Type(() => FireblocksVaultAssetDto)
  @Expose()
  wallet!: FireblocksVaultAssetDto;
}

@Exclude()
export class FireblocksAssetMetadataDto {
  @ApiProperty({ description: 'Asset id', example: 'USDC_POLYGON' })
  @IsString()
  @Expose()
  id!: string;

  @ApiProperty({
    description: 'Asset display name',
    example: 'USD Coin (Polygon)',
  })
  @IsString()
  @Expose()
  name!: string;

  @ApiProperty({ description: 'Asset symbol', example: 'USDC' })
  @IsString()
  @Expose()
  symbol!: string;

  @ApiProperty({ description: 'Asset type', example: 'CRYPTO' })
  @IsString()
  @Expose()
  type!: string;

  @ApiPropertyOptional({
    description: 'Native blockchain asset id',
    example: 'MATIC',
  })
  @IsOptional()
  @IsString()
  @Expose()
  nativeAsset?: string;

  @ApiPropertyOptional({
    description: 'Blockchain id / protocol',
    example: 'POLYGON',
  })
  @IsOptional()
  @IsString()
  @Expose()
  blockchainId?: string;

  @ApiPropertyOptional({
    description: 'Blockchain protocol name',
    example: 'Polygon PoS',
  })
  @IsOptional()
  @IsString()
  @Expose()
  blockchainProtocol?: string;

  @ApiPropertyOptional({
    description: 'Whether memos/tags are required',
    example: false,
  })
  @IsOptional()
  @Expose()
  hasTag?: boolean;

  @ApiPropertyOptional({
    description: 'Whether asset is supported in workspace',
    example: true,
  })
  @IsOptional()
  @Expose()
  isSupported?: boolean;

  @ApiPropertyOptional({
    description: 'Whether asset is suspended/disabled in workspace',
    example: false,
  })
  @IsOptional()
  @Expose()
  isSuspended?: boolean;
}

@Exclude()
export class FireblocksBlockchainDto {
  @ApiProperty({ description: 'Blockchain id', example: 'POLYGON' })
  @IsString()
  @Expose()
  id!: string;

  @ApiProperty({
    description: 'Blockchain display name',
    example: 'Polygon PoS',
  })
  @IsString()
  @Expose()
  name!: string;

  @ApiPropertyOptional({ description: 'Blockchain description' })
  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @ApiPropertyOptional({ description: 'Native asset id', example: 'MATIC' })
  @IsOptional()
  @IsString()
  @Expose()
  nativeAsset?: string;

  @ApiPropertyOptional({
    description: 'Status reported by Fireblocks',
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsString()
  @Expose()
  status?: string;
}

@Exclude()
export class FireblocksUserPortfolioDto {
  @ApiProperty({
    description: 'User reference id associated to the vault accounts',
    example: 'd13bd918-938a-4a5b-8b28-4fa3437ea5ce',
  })
  @IsString()
  @Expose()
  userRefId!: string;

  @ApiProperty({
    description: 'Vault accounts tied to the user',
    type: () => [FireblocksVaultAccountDto],
  })
  @ValidateNested({ each: true })
  @Type(() => FireblocksVaultAccountDto)
  @Expose()
  vaultAccounts!: FireblocksVaultAccountDto[];
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
export class FireblocksPaginatedAssetWalletResponseDto {
  @ApiPropertyOptional({
    description: 'Wallets in the page',
    type: () => [FireblocksVaultAssetDto],
  })
  @Expose()
  @Type(() => FireblocksVaultAssetDto)
  assetWallets?: FireblocksVaultAssetDto[];
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
