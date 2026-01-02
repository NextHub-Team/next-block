import { Injectable, Logger } from '@nestjs/common';
import { AccountsService } from '../../../../accounts/accounts.service';
import { AccountDto } from '../../../../accounts/dto/account.dto';
import {
  AccountProviderName,
  AccountStatus,
  KycStatus,
} from '../../../../accounts/types/account-enum.type';
import { FireblocksCwWalletsService } from '../../../../fireblocks-cw-wallets/fireblocks-cw-wallets.service';
import { FireblocksCwWallet } from '../../../../fireblocks-cw-wallets/domain/fireblocks-cw-wallet';
import {
  FireblocksCustodialWalletDto,
  FireblocksVaultAccountDto,
} from '../dto/fireblocks-cw-responses.dto';

/**
 * Centralizes persistence of Fireblocks vault account and wallet data into local repositories.
 */
@Injectable()
export class FireblocksCwSyncService {
  private readonly logger = new Logger(FireblocksCwSyncService.name);

  constructor(
    private readonly accountsService: AccountsService,
    private readonly fireblocksCwWalletsService: FireblocksCwWalletsService,
  ) {}

  /**
   * Upsert an account record for the given Fireblocks vault account.
   */
  async syncAccount(params: {
    vaultAccount: FireblocksVaultAccountDto;
    userId?: string | number;
    socialId?: string | null;
    email?: string | null;
    label?: string;
    metadata?: Record<string, unknown>;
    kycStatus?: KycStatus;
    status?: AccountStatus;
    customerRefId?: string | number;
  }): Promise<AccountDto | undefined> {
    this.logger.debug(
      `Syncing Fireblocks account ${params.vaultAccount.id} (customerRefId=${params.customerRefId ?? params.vaultAccount.customerRefId ?? 'none'})`,
    );

    const customerRefId =
      params.customerRefId ??
      params.vaultAccount.customerRefId ??
      params.userId ??
      params.socialId ??
      params.vaultAccount.name;

    if (!customerRefId) {
      this.logger.warn(
        `Account sync skipped for vault ${params.vaultAccount.id}: missing customerRefId`,
      );
      return undefined;
    }

    const metadata = this.cleanMetadata({
      customerRefId,
      name: params.vaultAccount.name,
      socialId: params.socialId ?? undefined,
      email: params.email ?? undefined,
      ...params.metadata,
    });

    try {
      const account = await this.accountsService.upsertByProviderAccountId({
        providerAccountId: params.vaultAccount.id,
        providerName: AccountProviderName.FIREBLOCKS,
        user: { id: customerRefId },
        KycStatus: params.kycStatus ?? KycStatus.VERIFIED,
        label: params.label ?? 'cw',
        metadata,
        status: params.status ?? AccountStatus.ACTIVE,
      });

      this.logger.log(
        `Synced Fireblocks account ${params.vaultAccount.id} to user ${customerRefId}`,
      );
      return account;
    } catch (error) {
      this.logger.error(
        `Failed to sync account ${params.vaultAccount.id}`,
        error instanceof Error ? error.stack : `${error}`,
      );
      throw error;
    }
  }

  /**
   * Upsert a wallet record (and its backing account) for the given custodial wallet DTO.
   */
  async syncWallet(params: {
    wallet: FireblocksCustodialWalletDto;
    userId?: string | number;
    socialId?: string | null;
    email?: string | null;
    label?: string;
    vaultType?: string;
    assetStatus?: string;
    metadata?: Record<string, unknown>;
  }): Promise<FireblocksCwWallet | undefined> {
    this.logger.debug(
      `Syncing Fireblocks wallet vault=${params.wallet.vaultAccount.id} asset=${params.wallet.vaultAsset.assetId ?? params.wallet.vaultAsset.id}`,
    );

    const account = await this.syncAccount({
      vaultAccount: params.wallet.vaultAccount,
      userId: params.userId,
      socialId: params.socialId,
      email: params.email,
      label: params.label,
      metadata: this.cleanMetadata({
        ...params.metadata,
        name: params.wallet.vaultAccount.name,
        customerRefId:
          params.wallet.vaultAccount.customerRefId ?? params.userId,
        assetId:
          params.wallet.vaultAsset.assetId ?? params.wallet.vaultAsset.id,
        address: params.wallet.depositAddress.address,
        tag: params.wallet.depositAddress.tag,
      }),
    });

    if (!account) {
      return undefined;
    }

    const assetId =
      params.wallet.vaultAsset.assetId ?? params.wallet.vaultAsset.id;

    try {
      const wallet = await this.fireblocksCwWalletsService.upsertByAccountId({
        accountId: account.id,
        assets: [
          {
            id: assetId,
            status: params.assetStatus ?? 'READY',
            address: params.wallet.depositAddress.address,
          },
        ],
        vaultType: params.vaultType,
        autoFuel: params.wallet.vaultAccount.autoFuel,
        hiddenOnUI: params.wallet.vaultAccount.hiddenOnUI,
        name: params.wallet.vaultAccount.name,
        customerRefId:
          params.wallet.vaultAccount.customerRefId ??
          params.wallet.vaultAccount.name ??
          `${account.id}`,
      });

      this.logger.log(
        `Synced Fireblocks wallet vault=${params.wallet.vaultAccount.id} asset=${assetId} to account ${account.id}`,
      );
      return wallet;
    } catch (error) {
      this.logger.error(
        `Failed to sync wallet vault=${params.wallet.vaultAccount.id} asset=${assetId}`,
        error instanceof Error ? error.stack : `${error}`,
      );
      throw error;
    }
  }

  private cleanMetadata(
    metadata: Record<string, unknown>,
  ): Record<string, unknown> | undefined {
    const cleaned = Object.fromEntries(
      Object.entries(metadata).filter(([_, value]) => {
        if (value === null || value === undefined) {
          return false;
        }

        if (typeof value === 'string' && value.trim().length === 0) {
          return false;
        }

        return true;
      }),
    );

    return Object.keys(cleaned).length ? cleaned : undefined;
  }
}
