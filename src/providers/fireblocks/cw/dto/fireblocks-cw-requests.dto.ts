import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

@Exclude()
export class FireblocksVaultAccountsQueryDto {
  @ApiPropertyOptional({
    description: 'Maximum number of vault accounts',
    example: 20,
  })
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Cursor to previous page',
    example: 'prev_cursor',
  })
  @Expose()
  @IsOptional()
  @IsString()
  before?: string;

  @ApiPropertyOptional({
    description: 'Cursor to next page',
    example: 'next_cursor',
  })
  @Expose()
  @IsOptional()
  @IsString()
  after?: string;

  @ApiPropertyOptional({
    description: 'Filter accounts by asset id',
    example: 'USDC',
  })
  @Expose()
  @IsOptional()
  @IsString()
  assetId?: string;

  @ApiPropertyOptional({
    description: 'Filter accounts by name prefix or customer ref id',
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
    description: 'Maximum number of asset wallets',
    example: 20,
  })
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Cursor to previous page',
    example: 'prev_cursor',
  })
  @Expose()
  @IsOptional()
  @IsString()
  before?: string;

  @ApiPropertyOptional({
    description: 'Cursor to next page',
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
export class FireblocksAssetsCatalogQueryDto {
  @ApiPropertyOptional({ description: 'Maximum number of assets', example: 100 })
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Opaque cursor from previous call (Fireblocks pageCursor)',
    example: 'abc123',
  })
  @Expose()
  @IsOptional()
  @IsString()
  cursor?: string;
}

@Exclude()
export class FireblocksUserIdentityDto {
  @ApiProperty({ description: 'Application user id', example: '123' })
  @IsNotEmpty()
  @Expose()
  id!: string | number;

  @ApiPropertyOptional({
    description:
      'User social id / external provider id (used for vault naming if present)',
    example: 'google-oauth2|abc123',
  })
  @IsOptional()
  @IsString()
  @Expose()
  socialId?: string;
}

@Exclude()
export class EnsureVaultWalletOptionsDto {
  @ApiPropertyOptional({ description: 'Hide from Console UI', example: false })
  @IsOptional()
  @IsBoolean()
  @Expose()
  hiddenOnUI?: boolean;

  @ApiPropertyOptional({ description: 'Enable auto fuel', example: true })
  @IsOptional()
  @IsBoolean()
  @Expose()
  autoFuel?: boolean;

  @ApiPropertyOptional({
    description: 'Deposit address description',
    example: 'Default deposit',
  })
  @IsOptional()
  @IsString()
  @Expose()
  addressDescription?: string;

  @ApiPropertyOptional({
    description: 'Idempotency key for Fireblocks requests',
    example: 'uuid-456',
  })
  @IsOptional()
  @IsString()
  @Expose()
  idempotencyKey?: string;
}

@Exclude()
export class FireblocksEnsureUserWalletDto {
  @ApiProperty({ description: 'The asset id that should exist on the vault' })
  @Expose()
  @IsString()
  assetId!: string;

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

@Exclude()
export class CreateVaultWalletRequestDto {
  @ApiProperty({ description: 'Vault account name', example: 'user-123' })
  @IsString()
  @Expose()
  name!: string;

  @ApiProperty({ description: 'Asset id', example: 'USDC' })
  @IsString()
  @Expose()
  assetId!: string;

  @ApiPropertyOptional({
    description: 'Customer reference id to attach',
    example: 'user-ref-123',
  })
  @IsOptional()
  @IsString()
  @Expose()
  customerRefId?: string;

  @ApiPropertyOptional({
    description: 'Hide account in Fireblocks Console',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  hiddenOnUI?: boolean;

  @ApiPropertyOptional({
    description: 'Address description when creating a deposit address',
    example: 'Primary deposit',
  })
  @IsOptional()
  @IsString()
  @Expose()
  addressDescription?: string;

  @ApiPropertyOptional({ description: 'Enable auto-fuel', example: true })
  @IsOptional()
  @IsBoolean()
  @Expose()
  autoFuel?: boolean;

  @ApiPropertyOptional({
    description: 'Idempotency key for Fireblocks requests',
    example: 'uuid-123',
  })
  @IsOptional()
  @IsString()
  @Expose()
  idempotencyKey?: string;
}

@Exclude()
export class CreateUserVaultAssetRequestDto {
  @ApiProperty({ description: 'Target vault account id', example: 'va-123' })
  @IsString()
  @Expose()
  vaultAccountId!: string;

  @ApiProperty({ description: 'Asset id to create', example: 'AVAXTEST' })
  @IsString()
  @Expose()
  assetId!: string;

  @ApiPropertyOptional({
    description: 'Idempotency key for Fireblocks requests',
    example: 'uuid-asset',
  })
  @IsOptional()
  @IsString()
  @Expose()
  idempotencyKey?: string;
}

@Exclude()
export class CreateUserVaultAddressRequestDto {
  @ApiProperty({ description: 'Vault account id', example: 'va-123' })
  @IsString()
  @Expose()
  vaultAccountId!: string;

  @ApiProperty({ description: 'Asset id', example: 'AVAXTEST' })
  @IsString()
  @Expose()
  assetId!: string;

  @ApiPropertyOptional({
    description: 'Address description',
    example: 'Primary deposit',
  })
  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    description: 'Idempotency key',
    example: 'uuid-address',
  })
  @IsOptional()
  @IsString()
  @Expose()
  idempotencyKey?: string;
}

@Exclude()
export class UpdateCustodialWalletDto {
  @ApiPropertyOptional({ description: 'Vault name', example: 'user-123' })
  @IsOptional()
  @IsString()
  @Expose()
  name?: string;

  @ApiPropertyOptional({ description: 'Auto fuel flag', example: true })
  @IsOptional()
  @IsBoolean()
  @Expose()
  autoFuel?: boolean;

  @ApiPropertyOptional({
    description: 'Customer reference id',
    example: 'user-ref-123',
  })
  @IsOptional()
  @IsString()
  @Expose()
  customerRefId?: string;

  @ApiPropertyOptional({ description: 'Hide from UI', example: false })
  @IsOptional()
  @IsBoolean()
  @Expose()
  hiddenOnUI?: boolean;
}

@Exclude()
export class FireblocksSpecialAddressAssetDto {
  @ApiProperty({
    description: 'Asset identifier to create an address for',
    example: 'USDC',
  })
  @IsString()
  @Expose()
  assetId!: string;

  @ApiPropertyOptional({
    description: 'Optional description to apply to the deposit address',
    example: 'Special deposit',
  })
  @IsOptional()
  @IsString()
  @Expose()
  description?: string;
}

@Exclude()
export class FireblocksSpecialAddressesRequestDto {
  @ApiProperty({
    description:
      'Vault account identifier where the addresses should be created',
    example: '123456',
  })
  @IsString()
  @Expose()
  vaultAccountId!: string;

  @ApiProperty({
    description: 'Assets that require special deposit addresses',
    type: () => [FireblocksSpecialAddressAssetDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FireblocksSpecialAddressAssetDto)
  @Expose()
  assets!: FireblocksSpecialAddressAssetDto[];

  @ApiPropertyOptional({
    description: 'Customer reference id to attach to each new address',
    example: 'user-ref-123',
  })
  @IsOptional()
  @IsString()
  @Expose()
  customerRefId?: string;

  @ApiPropertyOptional({
    description: 'Fallback description for addresses that do not provide one',
    example: 'Special deposit',
  })
  @IsOptional()
  @IsString()
  @Expose()
  addressDescription?: string;

  @ApiPropertyOptional({
    description: 'Optional idempotency key for Fireblocks requests',
    example: 'uuid-special-addresses',
  })
  @IsOptional()
  @IsString()
  @Expose()
  idempotencyKey?: string;
}

@Exclude()
export class CreateUserVaultRequestDto {
  @ApiPropertyOptional({
    description: 'Hide account in Fireblocks Console',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  hiddenOnUI?: boolean;

  @ApiPropertyOptional({
    description: 'Enable auto-fuel',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  autoFuel?: boolean;

  @ApiPropertyOptional({
    description: 'Idempotency key for Fireblocks requests',
    example: 'uuid-123',
  })
  @IsOptional()
  @IsString()
  @Expose()
  idempotencyKey?: string;
}

@Exclude()
export class CreateAdminVaultAccountRequestDto {
  @ApiProperty({
    description: 'Vault account name',
    example: 'user:123',
  })
  @IsString()
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'Customer reference id to attach',
    example: 'user-ref-123',
  })
  @IsString()
  @Expose()
  customerRefId!: string;

  @ApiPropertyOptional({
    description: 'Hide account in Fireblocks Console',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  hiddenOnUI?: boolean;

  @ApiPropertyOptional({
    description: 'Enable auto-fuel',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  autoFuel?: boolean;

  @ApiPropertyOptional({
    description: 'Idempotency key for Fireblocks requests',
    example: 'uuid-123',
  })
  @IsOptional()
  @IsString()
  @Expose()
  idempotencyKey?: string;
}
