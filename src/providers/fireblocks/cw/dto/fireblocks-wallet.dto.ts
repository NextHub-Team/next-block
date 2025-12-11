import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';

@Exclude()
export class FireblocksVaultAssetDto {
  @ApiProperty({ description: 'Asset identifier', example: 'BTC' })
  @IsString()
  @Expose()
  id!: string;

  @ApiPropertyOptional({ description: 'Total balance', example: '1.23' })
  @IsOptional()
  @IsString()
  @Expose()
  total?: string;

  @ApiPropertyOptional({ description: 'Available balance', example: '0.5' })
  @IsOptional()
  @IsString()
  @Expose()
  available?: string;

  @ApiPropertyOptional({ description: 'Locked amount', example: '0.1' })
  @IsOptional()
  @IsString()
  @Expose()
  lockedAmount?: string;

  @ApiPropertyOptional({ description: 'Pending balance', example: '0.02' })
  @IsOptional()
  @IsString()
  @Expose()
  pending?: string;

  @ApiPropertyOptional({ description: 'Total staked', example: '0.01' })
  @IsOptional()
  @IsString()
  @Expose()
  totalStaked?: string;

  @ApiPropertyOptional({ description: 'Legacy balance field', example: '1.23' })
  @IsOptional()
  @IsString()
  @Expose()
  balance?: string;
}

@Exclude()
export class FireblocksVaultAccountDto {
  @ApiProperty({ description: 'Vault account id', example: '1' })
  @IsString()
  @Expose()
  id!: string;

  @ApiProperty({ description: 'Vault account name', example: 'user-1' })
  @IsString()
  @Expose()
  name!: string;

  @ApiPropertyOptional({ description: 'Customer reference id', example: 'user-ref-123' })
  @IsOptional()
  @IsString()
  @Expose()
  customerRefId?: string;

  @ApiPropertyOptional({ description: 'Should the account be hidden in UI', example: false })
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
  @ApiProperty({ description: 'Deposit address', example: 'bc1q...' })
  @IsString()
  @Expose()
  address!: string;

  @ApiPropertyOptional({ description: 'Memo / Tag if required', example: '123456' })
  @IsOptional()
  @IsString()
  @Expose()
  tag?: string;

  @ApiPropertyOptional({ description: 'Address description', example: 'Primary deposit' })
  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @ApiPropertyOptional({ description: 'Customer reference id', example: 'user-ref-123' })
  @IsOptional()
  @IsString()
  @Expose()
  customerRefId?: string;
}

@Exclude()
export class FireblocksCustodialWalletDto {
  @ApiProperty({ description: 'Vault account metadata', type: () => FireblocksVaultAccountDto })
  @ValidateNested()
  @Type(() => FireblocksVaultAccountDto)
  @Expose()
  vaultAccount!: FireblocksVaultAccountDto;

  @ApiProperty({ description: 'Vault asset metadata', type: () => FireblocksVaultAssetDto })
  @ValidateNested()
  @Type(() => FireblocksVaultAssetDto)
  @Expose()
  vaultAsset!: FireblocksVaultAssetDto;

  @ApiProperty({ description: 'Primary deposit address', type: () => FireblocksDepositAddressDto })
  @ValidateNested()
  @Type(() => FireblocksDepositAddressDto)
  @Expose()
  depositAddress!: FireblocksDepositAddressDto;
}

@Exclude()
export class FireblocksAssetMetadataDto {
  @ApiProperty({ description: 'Asset id', example: 'ETH' })
  @IsString()
  @Expose()
  id!: string;

  @ApiProperty({ description: 'Asset display name', example: 'Ethereum' })
  @IsString()
  @Expose()
  name!: string;

  @ApiProperty({ description: 'Asset symbol', example: 'ETH' })
  @IsString()
  @Expose()
  symbol!: string;

  @ApiProperty({ description: 'Asset type', example: 'CRYPTO' })
  @IsString()
  @Expose()
  type!: string;

  @ApiPropertyOptional({ description: 'Blockchain id', example: 'ETH' })
  @IsOptional()
  @IsString()
  @Expose()
  blockchainId?: string;

  @ApiPropertyOptional({ description: 'Whether memos/tags are required', example: false })
  @IsOptional()
  @Expose()
  hasTag?: boolean;

  @ApiPropertyOptional({ description: 'Whether asset is supported in workspace', example: true })
  @IsOptional()
  @Expose()
  isSupported?: boolean;
}

@Exclude()
export class FireblocksBlockchainDto {
  @ApiProperty({ description: 'Blockchain id', example: 'ETH' })
  @IsString()
  @Expose()
  id!: string;

  @ApiProperty({ description: 'Blockchain display name', example: 'Ethereum' })
  @IsString()
  @Expose()
  name!: string;

  @ApiPropertyOptional({ description: 'Blockchain description' })
  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @ApiPropertyOptional({ description: 'Native asset id', example: 'ETH' })
  @IsOptional()
  @IsString()
  @Expose()
  nativeAsset?: string;

  @ApiPropertyOptional({ description: 'Status reported by Fireblocks', example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  @Expose()
  status?: string;
}

@Exclude()
export class FireblocksUserPortfolioDto {
  @ApiProperty({ description: 'User reference id associated to the vault accounts', example: 'user-ref-123' })
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
