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

@Exclude()
export class FireblocksVaultAssetDto {
  @ApiProperty({ description: 'Asset identifier', example: 'BTC' })
  @IsString()
  @Expose()
  id!: string;

  @ApiPropertyOptional({
    description: 'Alias for asset identifier returned by Fireblocks (assetId)',
    example: 'BTC',
  })
  @IsOptional()
  @IsString()
  @Expose()
  assetId?: string;

  @ApiPropertyOptional({
    description: 'Vault account id that owns this asset wallet',
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  @Expose()
  vaultId?: string;

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
    example: 'user:0a7346d0-4611-11ef-8342-6760128cffdb',
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
    example: '0x4b9C3f8A8eD5F0b9e6f3A6F3eD7e9a4C2b1d0e5f',
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
    description: 'User social id / customerRefId used for vault accounts',
    example: 'auth0|64efb1d3c1f0c9123456789a',
  })
  @IsString()
  @Expose()
  socialId!: string;

  @ApiProperty({
    description: 'Vault accounts tied to the user',
    type: () => [FireblocksVaultAccountDto],
  })
  @ValidateNested({ each: true })
  @Type(() => FireblocksVaultAccountDto)
  @Expose()
  vaultAccounts!: FireblocksVaultAccountDto[];
}

@Exclude()
export class VaultAccountParamDto {
  @ApiProperty({
    description: 'Fireblocks vault account id (numeric)',
    example: '183',
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Expose()
  vaultAccountId!: number;
}

@Exclude()
export class VaultAccountAssetParamDto extends VaultAccountParamDto {
  @ApiProperty({
    description: 'Asset identifier within the vault account',
    example: 'ETH_TEST5',
  })
  @IsString()
  @Expose()
  assetId!: string;
}
