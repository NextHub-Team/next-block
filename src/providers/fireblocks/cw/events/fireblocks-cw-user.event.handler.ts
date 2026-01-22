import { Injectable } from '@nestjs/common';
import { InternalEventHandler } from '../../../../common/internal-events/helper/internal-event-handler.decorator';
import { InternalEvent } from '../../../../internal-events/domain/internal-event';
import {
  VERO_LOGIN_USER_ADDED_EVENT,
  VERO_LOGIN_USER_DELETED_EVENT,
} from '../../../../users/types/user-event.type';
import { UserEventDto } from '../../../../users/dto/user.dto';
import { UsersService } from '../../../../users/users.service';
import { AccountsService } from '../../../../accounts/accounts.service';
import {
  AccountProviderName,
  AccountStatus,
  KycStatus,
} from '../../../../accounts/types/account-enum.type';
import { FireblocksCwWalletsService } from '../../../../fireblocks-cw-wallets/fireblocks-cw-wallets.service';
import { FireblocksCwService } from '../fireblocks-cw.service';
import { FireblocksCwWorkflowService } from '../services/fireblocks-cw-workflow.service';
import { buildVaultName } from '../helpers/fireblocks-cw.helper';
import { ensureIdempotencyKey } from '../helpers/fireblocks-cw-service.helper';
import { InternalEventHandlerBase } from '../../../../common/internal-events/base/internal-event-handler.base';
import { AuthProvidersEnum } from '../../../../auth/auth-providers.enum';
import { VaultAccount } from '@fireblocks/ts-sdk';

@Injectable()
@InternalEventHandler(VERO_LOGIN_USER_ADDED_EVENT)
export class FireblocksCwUserAddedEventHandler extends InternalEventHandlerBase {
  private static readonly BASE_ASSET_ID = 'AVAXTEST';
  private static readonly ACCOUNT_LABEL = 'cw';

  constructor(
    private readonly fireblocksCwService: FireblocksCwService,
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
    private readonly fireblocksCwWalletsService: FireblocksCwWalletsService,
    private readonly fireblocksCwWorkflowService: FireblocksCwWorkflowService,
  ) {
    super(FireblocksCwUserAddedEventHandler.name);
  }

  async handle(event: InternalEvent): Promise<void> {
    const payload = new UserEventDto(event.payload as Partial<UserEventDto>);
    const eventId = this.id(event);

    this.received(
      event,
      eventId,
      payload,
      this.fireblocksCwService.getOptions().debugLogging,
    );

    if (!this.fireblocksCwService.getEnabled()) {
      this.logger.warn(
        `[trace=${eventId}] Fireblocks CW service is disabled; skipping vault+wallet provisioning.`,
      );
      this.processed(event, eventId);
      return;
    }

    try {
      const userId = Number(payload.userId);
      if (Number.isNaN(userId)) {
        const message = `Invalid user id in event payload: ${payload.userId}`;
        this.logger.error(`[trace=${eventId}] ${message}`);
        throw new Error(message);
      }

      this.logger.debug(`[trace=${eventId}] Resolving user ${userId}`);
      // Load user and derive deterministic vault naming.
      const user = await this.usersService.findById(userId);
      if (!user) {
        const message = `User ${payload.userId} not found for Fireblocks CW`;
        this.logger.error(`[trace=${eventId}] ${message}`);
        throw new Error(message);
      }

      if (user.provider !== AuthProvidersEnum.vero) {
        this.logger.debug(
          `[trace=${eventId}] User ${user.id} provider=${user.provider} not eligible for Fireblocks CW provisioning; skipping.`,
        );
        this.processed(event, eventId);
        return;
      }

      const socialId = user.socialId ?? payload.socialId;
      if (!socialId) {
        const message = `Missing socialId for user ${user.id}; cannot create Fireblocks vault`;
        this.logger.error(`[trace=${eventId}] ${message}`);
        throw new Error(message);
      }

      let account = await this.accountsService.findBySocialIdAndProviderName(
        socialId,
        AccountProviderName.FIREBLOCKS,
      );
      let vaultAccountId: string | undefined =
        (account?.accountId as string | undefined) ?? undefined;

      if (!account) {
        this.logger.debug(
          `[trace=${eventId}] Building vault name for user=${user.id} socialId=${socialId}`,
        );
        const vaultName = buildVaultName(user.id, socialId);
        const customerRefId = socialId;

        this.logger.debug(
          `[trace=${eventId}] Searching Fireblocks vault by name=${vaultName}`,
        );
        this.fireblocksCwService.isReady();
        const sdk = this.fireblocksCwService.getSdk();
        const paged = await sdk.vaults.getPagedVaultAccounts({
          namePrefix: vaultName,
          limit: 1,
        });
        const existingVault = (paged.data?.accounts ?? []).find(
          (fbAccount) =>
            (fbAccount as VaultAccount)?.name === vaultName ||
            (fbAccount as VaultAccount)?.customerRefId === customerRefId,
        ) as VaultAccount | undefined;

        let vaultAccount = existingVault;
        if (existingVault) {
          this.logger.debug(
            `[trace=${eventId}] Found Fireblocks vault ${existingVault.id} for user ${user.id}`,
          );
        } else {
          this.logger.debug(
            `[trace=${eventId}] Creating Fireblocks vault for user=${user.id} customerRefId=${customerRefId}`,
          );
          const created = await sdk.vaults.createVaultAccount({
            createVaultAccountRequest: {
              name: vaultName,
              customerRefId,
              hiddenOnUI: true,
              autoFuel: false,
            },
            idempotencyKey: ensureIdempotencyKey(),
          });
          vaultAccount = created.data as VaultAccount;
          this.logger.log(
            `[trace=${eventId}] Created Fireblocks vault account ${vaultAccount.id} for user ${user.id}`,
          );
        }

        if (!vaultAccount?.id) {
          const message = `Failed to resolve or create Fireblocks vault for user ${user.id}`;
          this.logger.error(`[trace=${eventId}] ${message}`);
          throw new Error(message);
        }

        this.logger.debug(
          `[trace=${eventId}] UpSerting account accountId=${vaultAccount.id} customerRefId=${customerRefId}`,
        );
        account = await this.accountsService.upsertByAccountId({
          accountId: vaultAccount.id as string,
          providerName: AccountProviderName.FIREBLOCKS,
          user: { id: user.id },
          kycStatus: KycStatus.VERIFIED,
          label: FireblocksCwUserAddedEventHandler.ACCOUNT_LABEL,
          status: AccountStatus.ACTIVE,
          customerRefId,
          name: (vaultAccount as VaultAccount).name ?? vaultName,
        });
        vaultAccountId = vaultAccount.id as string;
      } else {
        this.logger.debug(
          `[trace=${eventId}] Fireblocks account already exists for user ${user.id}; checking wallet state.`,
        );
        vaultAccountId = account.accountId as string;
      }

      if (!account?.id || !vaultAccountId) {
        const message = `Unable to resolve Fireblocks account record for user ${user.id}`;
        this.logger.error(`[trace=${eventId}] ${message}`);
        throw new Error(message);
      }

      this.logger.debug(
        `[trace=${eventId}] Ensuring Fireblocks vault+wallet for asset=${FireblocksCwUserAddedEventHandler.BASE_ASSET_ID}`,
      );
      const existingWallets =
        await this.fireblocksCwWalletsService.findByAccountId(account.id);
      const walletAlreadyStored = existingWallets.some(
        (wallet) =>
          wallet.assetId === FireblocksCwUserAddedEventHandler.BASE_ASSET_ID,
      );
      if (walletAlreadyStored) {
        this.logger.debug(
          `[trace=${eventId}] Wallet already exists locally for asset=${FireblocksCwUserAddedEventHandler.BASE_ASSET_ID}; skipping Fireblocks ensure.`,
        );
        this.processed(event, eventId);
        return;
      }

      const ensuredWallet =
        await this.fireblocksCwWorkflowService.ensureVaultWalletWorkflow(
          vaultAccountId,
          FireblocksCwUserAddedEventHandler.BASE_ASSET_ID,
        );

      // Ensure local wallet record exists for the ensured asset/address.
      await this.fireblocksCwWalletsService.upsertByAccountId({
        accountId: account.id,
        assetId:
          ensuredWallet.wallet.vaultAsset.assetId ??
          ensuredWallet.wallet.vaultAsset.id,
        address: ensuredWallet.wallet.depositAddress.address,
      });

      this.logger.log(
        `[trace=${eventId}] Fireblocks CW user-added workflow completed`,
      );
      this.processed(event, eventId);
    } catch (error) {
      this.logger.error(
        `[trace=${eventId}] Fireblocks CW user-added workflow failed`,
        (error as Error)?.stack ?? String(error),
      );
      this.failed(event, eventId, error);
    }
  }
}

@Injectable()
@InternalEventHandler(VERO_LOGIN_USER_DELETED_EVENT)
export class FireblocksCwUserDeletedEventHandler extends InternalEventHandlerBase {
  constructor(private readonly fireblocksCwService: FireblocksCwService) {
    super(FireblocksCwUserDeletedEventHandler.name);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async handle(event: InternalEvent): Promise<void> {
    const payload = new UserEventDto(event.payload as Partial<UserEventDto>);
    const eventId = this.id(event);

    this.received(
      event,
      eventId,
      payload,
      this.fireblocksCwService.getOptions().debugLogging,
    );

    try {
      // TODO: Add Fireblocks-specific side-effects (e.g., cleanup user resources).
      this.processed(event, eventId);
    } catch (error) {
      this.failed(event, eventId, error);
    }
  }
}
