import type {
  Asset,
  FireblocksResponse,
  PaginatedAssetWalletResponse,
  VaultAccount,
  VaultAccountsPagedResponse,
  VaultAsset,
} from '@fireblocks/ts-sdk';
import { FireblocksCwMapper } from '../../../../helpers/fireblocks-cw.mapper';
import {
  FireblocksAssetWalletsPageResponseDto,
  FireblocksBlockchainListResponseDto,
  FireblocksBlockchainResponseDto,
  FireblocksDepositAddressResponseDto,
  FireblocksResponseEnvelopeDto,
  FireblocksUserPortfolioResponseDto,
  FireblocksPaginatedAssetWalletResponseDto,
  FireblocksVaultAccountResponseDto,
  FireblocksVaultAccountsPageDto,
  FireblocksVaultAccountsPageResponseDto,
  FireblocksVaultAssetResponseDto,
} from '../../../../dto/fireblocks-response.dto';
import {
  FireblocksBlockchainDto,
  FireblocksDepositAddressDto,
} from '../../../../dto/fireblocks-wallet.dto';

export class FireblocksVaultResponseMapper {
  static vaultAccount(
    response: FireblocksResponse<VaultAccount>,
  ): FireblocksVaultAccountResponseDto {
    return {
      statusCode: response.statusCode,
      headers: response.headers,
      data: FireblocksCwMapper.toVaultAccountDto(
        response.data as VaultAccount,
        (response.data as VaultAccount)?.assets as VaultAsset[] | undefined,
      ),
    };
  }

  static vaultAsset(
    response: FireblocksResponse<VaultAsset>,
  ): FireblocksVaultAssetResponseDto {
    return {
      statusCode: response.statusCode,
      headers: response.headers,
      data: FireblocksCwMapper.toVaultAssetDto(response.data as VaultAsset),
    };
  }

  static vaultAccountsPage(
    response: FireblocksResponse<VaultAccountsPagedResponse>,
  ): FireblocksVaultAccountsPageResponseDto {
    const accounts =
      (response.data as VaultAccountsPagedResponse).accounts ?? [];
    const dto = new FireblocksVaultAccountsPageDto();
    dto.accounts = accounts.map((account) =>
      FireblocksCwMapper.toVaultAccountDto(
        account as VaultAccount,
        account.assets as VaultAsset[] | undefined,
      ),
    );
    dto.nextUrl = (response.data as VaultAccountsPagedResponse).nextUrl;
    dto.previousUrl = (response.data as VaultAccountsPagedResponse).previousUrl;

    return {
      statusCode: response.statusCode,
      headers: response.headers,
      data: dto,
    };
  }

  static assetWalletsPage(
    response: FireblocksResponse<PaginatedAssetWalletResponse>,
  ): FireblocksAssetWalletsPageResponseDto {
    const dto = new FireblocksPaginatedAssetWalletResponseDto();
    const wallets = (
      (response.data as PaginatedAssetWalletResponse).assetWallets ?? []
    ).map((wallet: any) =>
      FireblocksCwMapper.toVaultAssetDto(wallet as VaultAsset),
    );
    dto.assetWallets = wallets;

    return {
      statusCode: response.statusCode,
      headers: response.headers,
      data: dto,
    };
  }

  static depositAddress(
    response: FireblocksResponse<FireblocksDepositAddressDto>,
  ): FireblocksDepositAddressResponseDto {
    return {
      statusCode: response.statusCode,
      headers: response.headers,
      data: response.data as FireblocksDepositAddressDto,
    };
  }

  static userPortfolio(
    response: FireblocksResponse<any>,
  ): FireblocksUserPortfolioResponseDto {
    return {
      statusCode: response.statusCode,
      headers: response.headers,
      data: response.data,
    };
  }

  static blockchain(
    response: FireblocksResponse<Asset>,
  ): FireblocksBlockchainResponseDto {
    const data = FireblocksCwMapper.toAssetMetadataDto(response.data as Asset);
    return {
      statusCode: response.statusCode,
      headers: response.headers,
      data: data as FireblocksBlockchainDto,
    };
  }

  static blockchains(
    response: FireblocksResponse<Asset[]>,
  ): FireblocksBlockchainListResponseDto {
    const data = (response.data as Asset[]).map((asset) =>
      FireblocksCwMapper.toAssetMetadataDto(asset),
    );
    return {
      statusCode: response.statusCode,
      headers: response.headers,
      data: data as FireblocksBlockchainDto[],
    };
  }

  static envelope<T>(
    response: FireblocksResponse<T>,
  ): FireblocksResponseEnvelopeDto<T> {
    return {
      statusCode: response.statusCode,
      headers: response.headers,
      data: response.data,
    };
  }
}
