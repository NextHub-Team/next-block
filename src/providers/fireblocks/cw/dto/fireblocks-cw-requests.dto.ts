import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type, Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { lowerCaseTransformer } from '../../../../utils/transformers/string.transformer';
export {
  VaultAccountParamDto,
  VaultAccountAssetParamDto,
} from './fireblocks-cw-base.dto';

@Exclude()
export class VaultAccountsQueryDto {
  @ApiPropertyOptional({
    description: 'Maximum number of vault accounts',
    example: 50,
  })
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Cursor to previous page',
    example: 'cursor_prev_abc123def456',
  })
  @Expose()
  @IsOptional()
  @IsString()
  before?: string;

  @ApiPropertyOptional({
    description: 'Cursor to next page',
    example: 'cursor_next_def789abc012',
  })
  @Expose()
  @IsOptional()
  @IsString()
  after?: string;

  @ApiPropertyOptional({
    description: 'Filter accounts by asset id',
    example: 'USDC_POLYGON',
  })
  @Expose()
  @IsOptional()
  @IsString()
  assetId?: string;

  @ApiPropertyOptional({
    description: 'Filter accounts by name prefix or customer ref id',
    example: 'custody-user-019a',
  })
  @Expose()
  @IsOptional()
  @IsString()
  namePrefix?: string;
}

@Exclude()
export class AssetWalletsQueryDto {
  @ApiPropertyOptional({
    description: 'Maximum number of asset wallets',
    example: 100,
  })
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Cursor to previous page',
    example: 'cursor_prev_wallets_01',
  })
  @Expose()
  @IsOptional()
  @IsString()
  before?: string;

  @ApiPropertyOptional({
    description: 'Cursor to next page',
    example: 'cursor_next_wallets_02',
  })
  @Expose()
  @IsOptional()
  @IsString()
  after?: string;

  @ApiPropertyOptional({
    description: 'Filter asset wallets by asset id',
    example: 'ETH_TEST3',
  })
  @Expose()
  @IsOptional()
  @IsString()
  assetId?: string;
}

@Exclude()
export class AssetsCatalogQueryDto {
  @ApiPropertyOptional({
    description: 'Maximum number of assets',
    example: 200,
  })
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Opaque cursor from previous call (Fireblocks pageCursor)',
    example: 'cursor_assets_abc123',
  })
  @Expose()
  @IsOptional()
  @IsString()
  cursor?: string;
}

@Exclude()
export class UserIdentityDto {
  @ApiProperty({
    description: 'Application user id',
    example: '0a4d4a34-7e02-4ad9-a53f-0f7ef8a3d9bc',
  })
  @IsNotEmpty()
  @Expose()
  id!: string | number;

  @ApiPropertyOptional({
    description:
      'User social id / external provider id (used for vault naming if present)',
    example: 'auth0|64efb1d3c1f0c9123456789a',
  })
  @IsOptional()
  @IsString()
  @Expose()
  socialId?: string;
}

@Exclude()
export class EnsureVaultWalletOptionsDto {
  @ApiPropertyOptional({ description: 'Hide from Console UI', example: true })
  @IsOptional()
  @IsBoolean()
  @Expose()
  hiddenOnUI?: boolean;

  @ApiPropertyOptional({ description: 'Enable auto fuel', example: false })
  @IsOptional()
  @IsBoolean()
  @Expose()
  autoFuel?: boolean;

  @ApiPropertyOptional({
    description: 'Deposit address description',
    example: 'Dedicated OTC deposit',
  })
  @IsOptional()
  @IsString()
  @Expose()
  addressDescription?: string;

  @ApiPropertyOptional({
    description: 'Idempotency key for Fireblocks requests',
    example: '79c6a2d5-63fe-4a93-8980-863deec95bf2',
  })
  @IsOptional()
  @IsString()
  @Expose()
  idempotencyKey?: string;
}

@Exclude()
export class VaultAccountsByIdsQueryDto {
  @ApiProperty({
    description: 'Comma-separated list of Fireblocks vault account ids',
    example: '1,2,3',
    type: String,
  })
  @Expose()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value
      : String(value)
          .split(',')
          .map((v) => v.trim())
          .filter((v) => v.length > 0),
  )
  @IsArray()
  @IsString({ each: true })
  ids!: string[];
}

@Exclude()
export class EnsureWalletDtoBase {
  @ApiProperty({ description: 'The asset id that should exist on the vault' })
  @Expose()
  @IsString()
  assetId!: string;
}

@Exclude()
export class EnsureUserWalletDto extends EnsureWalletDtoBase {}

@Exclude()
export class EnsureVaultWalletRequestDto extends EnsureWalletDtoBase {
  @ApiProperty({
    description: 'Vault account id to ensure the wallet for',
    example: '123456789',
  })
  @Expose()
  @IsString()
  vaultAccountId!: string;
}

@Exclude()
export class CreateVaultWalletRequestDto {
  @ApiProperty({
    description: 'Vault account name',
    example: 'custody-user-019a3bf6',
  })
  @IsString()
  @Expose()
  name!: string;

  @ApiProperty({ description: 'Asset id', example: 'USDC_POLYGON' })
  @IsString()
  @Expose()
  assetId!: string;

  @ApiPropertyOptional({
    description: 'Customer reference id to attach',
    example: 'd13bd918-938a-4a5b-8b28-4fa3437ea5ce',
  })
  @IsOptional()
  @IsString()
  @Expose()
  customerRefId?: string;

  @ApiPropertyOptional({
    description: 'Hide account in Fireblocks Console',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  hiddenOnUI?: boolean;

  @ApiPropertyOptional({
    description: 'Address description when creating a deposit address',
    example: 'Primary Polygon deposit',
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
    example: '5a76c74d-45b1-4457-9368-140f64e568df',
  })
  @IsOptional()
  @IsString()
  @Expose()
  idempotencyKey?: string;
}

@Exclude()
export class CreateUserVaultAssetRequestDto {
  @ApiProperty({
    description: 'Target vault account id',
    example: '123456789',
  })
  @IsString()
  @Expose()
  vaultAccountId!: string;

  @ApiProperty({ description: 'Asset id to create', example: 'AVAXCCHAIN' })
  @IsString()
  @Expose()
  assetId!: string;

  @ApiPropertyOptional({
    description: 'Idempotency key for Fireblocks requests',
    example: '7f3bce64-30c0-4b7a-a561-6a83376fd2e0',
  })
  @IsOptional()
  @IsString()
  @Expose()
  idempotencyKey?: string;
}

@Exclude()
export class CreateUserVaultAddressRequestDto {
  @ApiProperty({
    description: 'Vault account id',
    example: '123456789',
  })
  @IsString()
  @Expose()
  vaultAccountId!: string;

  @ApiProperty({ description: 'Asset id', example: 'ETH_TEST3' })
  @IsString()
  @Expose()
  assetId!: string;

  @ApiPropertyOptional({
    description: 'Address description',
    example: 'Primary ETH deposit address',
  })
  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    description: 'Idempotency key',
    example: '3f5885d6-61c2-4a64-8f88-6cf3e07a5d91',
  })
  @IsOptional()
  @IsString()
  @Expose()
  idempotencyKey?: string;
}

@Exclude()
export class UpdateCustodialWalletDto {
  @ApiPropertyOptional({
    description: 'Vault name',
    example: 'custody-user-019a3bf6',
  })
  @IsOptional()
  @IsString()
  @Expose()
  name?: string;

  @ApiPropertyOptional({ description: 'Auto fuel flag', example: false })
  @IsOptional()
  @IsBoolean()
  @Expose()
  autoFuel?: boolean;

  @ApiPropertyOptional({
    description: 'Customer reference id',
    example: 'd13bd918-938a-4a5b-8b28-4fa3437ea5ce',
  })
  @IsOptional()
  @IsString()
  @Expose()
  customerRefId?: string;

  @ApiPropertyOptional({ description: 'Hide from UI', example: true })
  @IsOptional()
  @IsBoolean()
  @Expose()
  hiddenOnUI?: boolean;
}

@Exclude()
export class SpecialAddressAssetDto {
  @ApiProperty({
    description: 'Asset identifier to create an address for',
    example: 'XRP',
  })
  @IsString()
  @Expose()
  assetId!: string;

  @ApiPropertyOptional({
    description: 'Optional description to apply to the deposit address',
    example: 'OTC settlement flow',
  })
  @IsOptional()
  @IsString()
  @Expose()
  description?: string;
}

@Exclude()
export class SpecialAddressesRequestDto {
  @ApiProperty({
    description:
      'Vault account identifier where the addresses should be created',
    example: '2468101214',
  })
  @IsString()
  @Expose()
  vaultAccountId!: string;

  @ApiProperty({
    description: 'Assets that require special deposit addresses',
    type: () => [SpecialAddressAssetDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecialAddressAssetDto)
  @Expose()
  assets!: SpecialAddressAssetDto[];

  @ApiPropertyOptional({
    description: 'Customer reference id to attach to each new address',
    example: 'd13bd918-938a-4a5b-8b28-4fa3437ea5ce',
  })
  @IsOptional()
  @IsString()
  @Expose()
  customerRefId?: string;

  @ApiPropertyOptional({
    description: 'Fallback description for addresses that do not provide one',
    example: 'VIP OTC deposit',
  })
  @IsOptional()
  @IsString()
  @Expose()
  addressDescription?: string;

  @ApiPropertyOptional({
    description: 'Optional idempotency key for Fireblocks requests',
    example: 'a4f2a96f-bc42-4e02-8e61-460fdddf1eaa',
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
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  autoFuel?: boolean;

  @ApiPropertyOptional({
    description: 'Idempotency key for Fireblocks requests',
    example: '5de2ad69-0ea8-4a66-a1cb-6ad72037d1df',
  })
  @IsOptional()
  @IsString()
  @Expose()
  idempotencyKey?: string;
}

@Exclude()
export class CreateAdminVaultAccountRequestDto {
  @ApiProperty({
    description: 'User social id to derive name/customerRefId',
    example: '0a7346d0-4611-11ef-8342-6760128cffdb',
  })
  @IsString()
  @Expose()
  socialId!: string;

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
    example: '0f114b2f-19d8-4f74-aa58-23cc6a8a475f',
  })
  @IsOptional()
  @IsString()
  @Expose()
  idempotencyKey?: string;
}

@Exclude()
export class BulkCreateVaultAccountUserDto {
  @ApiProperty({
    description: 'User social id (UUID)',
    example: 'b0f76a18-3c9c-4db9-b9e4-3cbb1f1b4869',
  })
  @IsUUID()
  @Expose()
  socialId!: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @Expose()
  email!: string;
}

@Exclude()
export class BulkCreateVaultAccountsRequestDto {
  @ApiProperty({
    description: 'Users (socialId + email) to create vault accounts for',
    type: () => [BulkCreateVaultAccountUserDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkCreateVaultAccountUserDto)
  @Expose()
  users!: BulkCreateVaultAccountUserDto[];

  @ApiPropertyOptional({
    description: 'Base asset IDs to enable on each created vault account',
    example: ['USDC_POLYGON', 'ETH_TEST3'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Expose()
  baseAssetIds?: string[];

  @ApiPropertyOptional({
    description: 'Hide accounts in Fireblocks Console',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  hiddenOnUI?: boolean = true;

  @ApiPropertyOptional({
    description: 'Enable auto-fuel',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  autoFuel?: boolean = true;
}
