import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AccountsService } from '../../../../accounts/accounts.service';
import { AccountDto } from '../../../../accounts/dto/account.dto';
import { UsersService } from '../../../../users/users.service';
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
import {
  cleanMetadata,
  normalizeNumericUserId,
} from '../helpers/fireblocks-cw-service.helper';

/**
 * Centralizes persistence of Fireblocks vault account and wallet data into local repositories.
 */
@Injectable()
export class FireblocksCwSyncService {
  private readonly logger = new Logger(FireblocksCwSyncService.name);

  constructor(
    private readonly accountsService: AccountsService,
    private readonly fireblocksCwWalletsService: FireblocksCwWalletsService,
    private readonly usersService: UsersService,
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

    const hasSocialId =
      typeof params.socialId === 'string' &&
      params.socialId.trim().length > 0 &&
      params.socialId !== 'null';
    if (!hasSocialId && typeof params.userId !== 'undefined') {
      const message = `Invalid user info for vault ${params.vaultAccount.id}: invalid social id`;
      this.logger.error(message);
      throw new BadRequestException('Invalid user info: invalid social id');
    }

    const customerRefId =
      params.customerRefId ??
      params.vaultAccount.customerRefId ??
      params.userId ??
      params.socialId ??
      params.vaultAccount.name;
    const userId = await this.resolveUserId({
      userId: params.userId,
      customerRefId: params.customerRefId ?? params.vaultAccount.customerRefId,
      socialId: params.socialId,
      vaultAccount: params.vaultAccount,
    });

    if (!customerRefId) {
      this.logger.warn(
        `Account sync skipped for vault ${params.vaultAccount.id}: missing customerRefId`,
      );
      return undefined;
    }

    if (typeof userId === 'undefined') {
      const message = `Invalid user info for vault ${params.vaultAccount.id}: missing numeric user id (customerRefId=${params.customerRefId ?? params.vaultAccount.customerRefId ?? 'none'}, socialId=${params.socialId ?? params.vaultAccount.customerRefId ?? 'none'})`;
      this.logger.error(message);
      throw new BadRequestException('Invalid user info: missing user id');
    }

    const metadata = cleanMetadata({
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
        user: { id: userId },
        KycStatus: params.kycStatus ?? KycStatus.VERIFIED,
        label: params.label ?? 'cw',
        metadata,
        status: params.status ?? AccountStatus.ACTIVE,
      });

      this.logger.log(
        `Synced Fireblocks account ${params.vaultAccount.id} to user ${userId}`,
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
      metadata: cleanMetadata({
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

  private async resolveUserId(params: {
    userId?: string | number;
    customerRefId?: string | number;
    socialId?: string | null;
    vaultAccount?: FireblocksVaultAccountDto;
  }): Promise<number | undefined> {
    const numericCandidates = [
      params.userId,
      params.customerRefId,
      params.vaultAccount?.customerRefId,
    ];

    for (const candidate of numericCandidates) {
      const normalized = normalizeNumericUserId(candidate);
      if (typeof normalized !== 'undefined') {
        return normalized;
      }
    }

    const socialCandidates = [
      params.socialId,
      typeof params.customerRefId === 'string'
        ? params.customerRefId
        : undefined,
      typeof params.vaultAccount?.customerRefId === 'string'
        ? params.vaultAccount.customerRefId
        : undefined,
    ].filter(
      (value): value is string =>
        typeof value === 'string' && value.trim().length > 0,
    );

    for (const socialId of socialCandidates) {
      const user = await this.usersService.findBySocialId(socialId);
      if (typeof user?.id !== 'undefined') {
        const normalizedUserId = normalizeNumericUserId(
          user.id as number | string,
        );
        if (typeof normalizedUserId !== 'undefined') {
          return normalizedUserId;
        }
      }
    }

    return undefined;
  }
}
