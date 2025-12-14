import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  FireblocksCustodialWalletDto,
  FireblocksUserPortfolioDto,
  FireblocksVaultAccountDto,
  FireblocksVaultAccountWalletDto,
  FireblocksVaultAssetDto,
} from '../dto/fireblocks-wallet.dto';
import {
  CreateVaultWalletRequestDto,
  EnsureVaultWalletOptionsDto,
  FireblocksUserIdentityDto,
} from '../dto/fireblocks-vault-requests.dto';
import { FireblocksCwVaultService } from './fireblocks-cw-vault.service';

@Injectable()
export class FireblocksCwClientService {
  constructor(public readonly vaults: FireblocksCwVaultService) {}

  // Backward compatibility aliases for merged vault service
  get deposits(): FireblocksCwVaultService {
    return this.vaults;
  }

  get portfolio(): FireblocksCwVaultService {
    return this.vaults;
  }

  async createWallet(
    command: CreateVaultWalletRequestDto,
  ): Promise<FireblocksCustodialWalletDto> {
    return this.vaults.createVaultWalletForAsset(command);
  }

  async ensureUserWallet(
    user: FireblocksUserIdentityDto,
    assetId: string,
    options?: EnsureVaultWalletOptionsDto,
  ): Promise<FireblocksCustodialWalletDto> {
    return this.vaults.ensureUserVaultWalletForAsset(user, assetId, options);
  }

  async listUserVaultAccounts(
    userId: string | number,
  ): Promise<FireblocksVaultAccountDto[]> {
    const portfolio = await this.getUserPortfolio(userId);
    return portfolio.vaultAccounts ?? [];
  }

  async getUserPortfolio(
    userId: string | number,
  ): Promise<FireblocksUserPortfolioDto> {
    return this.vaults.fetchUserPortfolio(`${userId}`);
  }

  async listUserVaultWallets(
    userId: string | number,
  ): Promise<FireblocksVaultAccountWalletDto[]> {
    const accounts = await this.listUserVaultAccounts(userId);
    const wallets: FireblocksVaultAccountWalletDto[] = [];
    for (const account of accounts) {
      const assets = account.assets ?? [];
      for (const asset of assets) {
        wallets.push({
          vaultAccount: account,
          wallet: asset,
        });
      }
    }
    return wallets;
  }

  async listUserVaultAccountWallets(
    userId: string | number,
    vaultAccountId: string,
  ): Promise<FireblocksVaultAssetDto[]> {
    const account = await this.getUserVaultAccount(userId, vaultAccountId);
    return account.assets ?? [];
  }

  async getUserVaultAccountWallet(
    userId: string | number,
    vaultAccountId: string,
    assetId: string,
  ): Promise<FireblocksVaultAssetDto> {
    await this.getUserVaultAccount(userId, vaultAccountId);
    return this.vaults.fetchVaultAccountAsset(vaultAccountId, assetId);
  }

  private async getUserVaultAccount(
    userId: string | number,
    vaultAccountId: string,
  ): Promise<FireblocksVaultAccountDto> {
    const account = await this.vaults.fetchVaultAccountById(vaultAccountId);
    const normalized = `${userId}`;
    if (account.customerRefId !== normalized) {
      throw new ForbiddenException(
        `Vault account ${vaultAccountId} is not associated with the current user`,
      );
    }
    return account;
  }
}
