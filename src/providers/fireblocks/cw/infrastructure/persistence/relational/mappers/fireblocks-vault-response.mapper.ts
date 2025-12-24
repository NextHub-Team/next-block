import type {
  Asset,
  FireblocksResponse,
  PaginatedAssetWalletResponse,
  VaultAccount,
  VaultAccountsPagedResponse,
  VaultAsset,
} from '@fireblocks/ts-sdk';
import { FireblocksCwMapper } from './fireblocks-cw.mapper';
import {
  FireblocksPaginatedAssetWalletResponseDto,
  FireblocksVaultAccountsPageDto,
  FireblocksBlockchainDto,
  FireblocksDepositAddressDto,
  FireblocksUserPortfolioDto,
  FireblocksVaultAccountDto,
  FireblocksVaultAssetDto,
} from '../../../../dto/fireblocks-cw-responses.dto';
import { GroupPlainToInstance } from '../../../../../../../utils/transformers/class.transformer';
import { RoleEnum } from '../../../../../../../roles/roles.enum';

export class FireblocksVaultResponseMapper {
  static vaultAccount(
    response: FireblocksResponse<VaultAccount>,
  ): FireblocksVaultAccountDto {
    const dto = FireblocksCwMapper.toVaultAccountDto(
      response.data as VaultAccount,
      (response.data as VaultAccount)?.assets as VaultAsset[] | undefined,
    );
    return GroupPlainToInstance(FireblocksVaultAccountDto, dto, [
      RoleEnum.admin,
    ]);
  }

  static vaultAsset(
    response: FireblocksResponse<VaultAsset>,
  ): FireblocksVaultAssetDto {
    const dto = FireblocksCwMapper.toVaultAssetDto(response.data as VaultAsset);
    return GroupPlainToInstance(FireblocksVaultAssetDto, dto, [RoleEnum.admin]);
  }

  static vaultAccountsPage(
    response: FireblocksResponse<VaultAccountsPagedResponse>,
  ): FireblocksVaultAccountsPageDto {
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

    return GroupPlainToInstance(FireblocksVaultAccountsPageDto, dto, [
      RoleEnum.admin,
    ]);
  }

  static assetWalletsPage(
    response: FireblocksResponse<PaginatedAssetWalletResponse>,
  ): FireblocksPaginatedAssetWalletResponseDto {
    const dto = new FireblocksPaginatedAssetWalletResponseDto();
    const wallets = (
      (response.data as PaginatedAssetWalletResponse).assetWallets ?? []
    ).map((wallet: any) =>
      FireblocksCwMapper.toVaultAssetDto(wallet as VaultAsset),
    );
    dto.assetWallets = wallets;

    return GroupPlainToInstance(
      FireblocksPaginatedAssetWalletResponseDto,
      dto,
      [RoleEnum.admin],
    );
  }

  static depositAddress(
    response: FireblocksResponse<FireblocksDepositAddressDto>,
  ): FireblocksDepositAddressDto {
    return GroupPlainToInstance(
      FireblocksDepositAddressDto,
      response.data as FireblocksDepositAddressDto,
      [RoleEnum.admin],
    );
  }

  static userPortfolio(
    response: FireblocksResponse<any>,
  ): FireblocksUserPortfolioDto {
    return GroupPlainToInstance(
      FireblocksUserPortfolioDto,
      response.data as FireblocksUserPortfolioDto,
      [RoleEnum.admin],
    );
  }

  static blockchain(
    response: FireblocksResponse<Asset>,
  ): FireblocksBlockchainDto {
    const data = FireblocksCwMapper.toAssetMetadataDto(response.data as Asset);
    return GroupPlainToInstance(
      FireblocksBlockchainDto,
      data as FireblocksBlockchainDto,
      [RoleEnum.admin],
    );
  }

  static blockchains(
    response: FireblocksResponse<Asset[]>,
  ): FireblocksBlockchainDto[] {
    const data = (response.data as Asset[]).map((asset) =>
      FireblocksCwMapper.toAssetMetadataDto(asset),
    );
    return data.map((item) =>
      GroupPlainToInstance(
        FireblocksBlockchainDto,
        item as FireblocksBlockchainDto,
        [RoleEnum.admin],
      ),
    );
  }
}
