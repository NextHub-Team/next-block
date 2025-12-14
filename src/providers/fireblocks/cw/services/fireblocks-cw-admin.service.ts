import { Injectable } from '@nestjs/common';
import {
  FireblocksAssetWalletsPageResponseDto,
  FireblocksResponseEnvelopeDto,
  FireblocksVaultAccountResponseDto,
  FireblocksVaultAssetResponseDto,
  FireblocksVaultAccountsPageResponseDto,
  FireblocksSpecialAddressesResponseDto,
  FireblocksUserPortfolioResponseDto,
} from '../dto/fireblocks-response.dto';
import {
  FireblocksAssetWalletsQueryDto,
  FireblocksVaultAccountsQueryDto,
} from '../dto/fireblocks-cw-controller.dto';
import { FireblocksSpecialAddressesRequestDto } from '../dto/fireblocks-vault-requests.dto';
import { FireblocksCwAdminVaultService } from './fireblocks-cw-admin-vault.service';

@Injectable()
export class FireblocksCwAdminService {
  constructor(public readonly vaults: FireblocksCwAdminVaultService) {}

  async getUserWallets(
    userId: string,
  ): Promise<FireblocksUserPortfolioResponseDto> {
    return this.vaults.fetchUserPortfolioByCustomerRefId(userId);
  }

  listAssetWallets(
    query: FireblocksAssetWalletsQueryDto,
  ): Promise<FireblocksAssetWalletsPageResponseDto> {
    return this.vaults.listAssetWalletsPaged(
      query.limit,
      query.before,
      query.after,
      query.assetId,
    );
  }

  createSpecialAddresses(
    body: FireblocksSpecialAddressesRequestDto,
  ): Promise<
    FireblocksResponseEnvelopeDto<FireblocksSpecialAddressesResponseDto>
  > {
    return this.vaults.createSpecialAddressesForAssets(body);
  }

  listVaultAccounts(
    query: FireblocksVaultAccountsQueryDto,
  ): Promise<FireblocksVaultAccountsPageResponseDto> {
    return this.vaults.listVaultAccountsPaged(
      query.limit,
      query.before,
      query.after,
      query.assetId,
      query.namePrefix,
    );
  }

  fetchVaultAccount(
    vaultAccountId: string,
  ): Promise<FireblocksVaultAccountResponseDto> {
    return this.vaults.fetchVaultAccountById(vaultAccountId);
  }

  fetchVaultAsset(
    vaultAccountId: string,
    assetId: string,
  ): Promise<FireblocksVaultAssetResponseDto> {
    return this.vaults.fetchVaultAccountAsset(vaultAccountId, assetId);
  }
}
