import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

@Exclude()
export class FireblocksUserIdentityDto {
  @ApiProperty({ description: 'Application user id', example: '123' })
  @IsNotEmpty()
  @Expose()
  userId!: string | number;

  @ApiPropertyOptional({
    description: 'External/provider id fallback',
    example: 'provider-123',
  })
  @IsOptional()
  @IsString()
  @Expose()
  providerId?: string | null;
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
