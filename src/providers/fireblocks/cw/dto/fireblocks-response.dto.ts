import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  FireblocksBlockchainDto,
  FireblocksCustodialWalletDto,
  FireblocksDepositAddressDto,
  FireblocksUserPortfolioDto,
  FireblocksVaultAccountDto,
  FireblocksVaultAssetDto,
} from './fireblocks-wallet.dto';

@Exclude()
export class FireblocksResponseEnvelopeDto<T> {
  @ApiProperty({ description: 'HTTP status code from Fireblocks' })
  @Expose()
  statusCode!: number;

  @ApiProperty({
    description: 'HTTP response headers',
    type: Object,
    additionalProperties: { type: 'string' },
  })
  @Expose()
  headers!: Record<string, string>;

  @ApiProperty({ description: 'Mapped payload', type: Object })
  @Expose()
  data!: T;
}

@Exclude()
export class FireblocksVaultAccountsPageDto {
  @ApiPropertyOptional({
    description: 'Vault accounts in this page',
    type: () => [FireblocksVaultAccountDto],
  })
  @Expose()
  @Type(() => FireblocksVaultAccountDto)
  accounts?: FireblocksVaultAccountDto[];

  @ApiPropertyOptional({
    description: 'Paging cursor (next url)',
    example: '/v1/vault/accounts?after=abc',
  })
  @Expose()
  nextUrl?: string;

  @ApiPropertyOptional({
    description: 'Paging cursor (previous url)',
    example: '/v1/vault/accounts?before=def',
  })
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
export class FireblocksCustodialWalletResponseDto extends FireblocksResponseEnvelopeDto<FireblocksCustodialWalletDto> {
  @ApiProperty({
    description: 'Custodial wallet details (vault, asset, deposit address)',
    type: () => FireblocksCustodialWalletDto,
  })
  @Expose()
  @Type(() => FireblocksCustodialWalletDto)
  declare data: FireblocksCustodialWalletDto;
}

@Exclude()
export class FireblocksVaultAccountResponseDto extends FireblocksResponseEnvelopeDto<FireblocksVaultAccountDto> {
  @ApiProperty({
    description: 'Single vault account mapped from SDK response',
    type: () => FireblocksVaultAccountDto,
  })
  @Expose()
  @Type(() => FireblocksVaultAccountDto)
  declare data: FireblocksVaultAccountDto;
}

@Exclude()
export class FireblocksVaultAssetResponseDto extends FireblocksResponseEnvelopeDto<FireblocksVaultAssetDto> {
  @ApiProperty({
    description: 'Single vault asset mapped from SDK response',
    type: () => FireblocksVaultAssetDto,
  })
  @Expose()
  @Type(() => FireblocksVaultAssetDto)
  declare data: FireblocksVaultAssetDto;
}

@Exclude()
export class FireblocksVaultAccountsPageResponseDto extends FireblocksResponseEnvelopeDto<FireblocksVaultAccountsPageDto> {
  @ApiProperty({
    description: 'Paged vault accounts with cursors',
    type: () => FireblocksVaultAccountsPageDto,
  })
  @Expose()
  @Type(() => FireblocksVaultAccountsPageDto)
  declare data: FireblocksVaultAccountsPageDto;
}

@Exclude()
export class FireblocksAssetWalletsPageResponseDto extends FireblocksResponseEnvelopeDto<FireblocksPaginatedAssetWalletResponseDto> {
  @ApiProperty({
    description: 'Paged vault asset wallets mapped from SDK response',
    type: () => FireblocksPaginatedAssetWalletResponseDto,
  })
  @Expose()
  @Type(() => FireblocksPaginatedAssetWalletResponseDto)
  declare data: FireblocksPaginatedAssetWalletResponseDto;
}

@Exclude()
export class FireblocksDepositAddressResponseDto extends FireblocksResponseEnvelopeDto<FireblocksDepositAddressDto> {
  @ApiProperty({
    description: 'Deposit address payload mapped from SDK response',
    type: () => FireblocksDepositAddressDto,
  })
  @Expose()
  @Type(() => FireblocksDepositAddressDto)
  declare data: FireblocksDepositAddressDto;
}

@Exclude()
export class FireblocksUserPortfolioResponseDto extends FireblocksResponseEnvelopeDto<FireblocksUserPortfolioDto> {
  @ApiProperty({
    description: 'User portfolio derived from vault accounts',
    type: () => FireblocksUserPortfolioDto,
  })
  @Expose()
  @Type(() => FireblocksUserPortfolioDto)
  declare data: FireblocksUserPortfolioDto;
}

@Exclude()
export class FireblocksBlockchainResponseDto extends FireblocksResponseEnvelopeDto<FireblocksBlockchainDto> {
  @ApiProperty({
    description: 'Blockchain metadata mapped from Fireblocks SDK',
    type: () => FireblocksBlockchainDto,
  })
  @Expose()
  @Type(() => FireblocksBlockchainDto)
  declare data: FireblocksBlockchainDto;
}

@Exclude()
export class FireblocksBlockchainListResponseDto extends FireblocksResponseEnvelopeDto<
  FireblocksBlockchainDto[]
> {
  @ApiProperty({
    description: 'List of blockchain metadata items',
    type: () => [FireblocksBlockchainDto],
  })
  @Expose()
  @Type(() => FireblocksBlockchainDto)
  declare data: FireblocksBlockchainDto[];
}
