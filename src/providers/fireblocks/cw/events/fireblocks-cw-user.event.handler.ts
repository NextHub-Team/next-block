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
import { buildCustomerRefId } from '../helpers/fireblocks-cw.helper';
import { InternalEventHandlerBase } from '../../../../common/internal-events/base/internal-event-handler.base';

@Injectable()
@InternalEventHandler(VERO_LOGIN_USER_ADDED_EVENT)
export class FireblocksCwUserAddedEventHandler extends InternalEventHandlerBase {
  private static readonly BASE_ASSET_ID = 'AVAXTEST';
  private static readonly DEFAULT_WALLET_STATUS = 'READY';
  private static readonly ACCOUNT_LABEL = 'cw';
  private static readonly WALLET_VAULT_TYPE = 'SYSTEM';

  constructor(
    private readonly fireblocksCwService: FireblocksCwService,
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
    private readonly fireblocksCwWalletsService: FireblocksCwWalletsService,
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

      this.logger.debug(
        `[trace=${eventId}] Building vault name for user=${user.id} socialId=${user.socialId ?? payload.socialId ?? 'none'}`,
      );
      const vaultName = await this.fireblocksCwService.buildVaultName(
        user.id,
        user.socialId ?? payload.socialId,
      );

      this.logger.debug(
        `[trace=${eventId}] Ensuring Fireblocks vault+wallet for asset=${FireblocksCwUserAddedEventHandler.BASE_ASSET_ID}`,
      );
      // Ensure Fireblocks vault + AVAXTEST wallet + deposit address.
      const wallet = await this.fireblocksCwService.client.ensureUserWallet(
        { id: user.id, socialId: user.socialId ?? payload.socialId },
        FireblocksCwUserAddedEventHandler.BASE_ASSET_ID,
        {
          hiddenOnUI: true,
        },
      );

      const customerRefId =
        wallet.vaultAccount.customerRefId ??
        buildCustomerRefId(user.id, user.socialId ?? payload.socialId);

      this.logger.debug(
        `[trace=${eventId}] UpSerting account providerId=${wallet.vaultAccount.id} customerRefId=${customerRefId}`,
      );
      // Persist/update local account pointing to the Fireblocks vault.
      const account = await this.accountsService.upsertByProviderAccountId({
        providerAccountId: wallet.vaultAccount.id,
        providerName: AccountProviderName.FIREBLOCKS,
        user: { id: user.id },
        KycStatus: KycStatus.VERIFIED,
        label: FireblocksCwUserAddedEventHandler.ACCOUNT_LABEL,
        metadata: this.cleanMetadata({
          name: wallet.vaultAccount.name ?? vaultName,
          customerRefId,
          assetId: wallet.vaultAsset.id,
          address: wallet.depositAddress.address,
          tag: wallet.depositAddress.tag,
          socialId: user.socialId ?? payload.socialId ?? undefined,
          email: user.email ?? payload.email,
        }),
        status: AccountStatus.ACTIVE,
      });

      this.logger.debug(
        `[trace=${eventId}] Persisting wallet for asset=${wallet.vaultAsset.id} address=${wallet.depositAddress.address}`,
      );
      // Save wallet record with deposit address for the ensured asset.
      await this.fireblocksCwWalletsService.create({
        account,
        assets: [
          {
            id: wallet.vaultAsset.id,
            status: FireblocksCwUserAddedEventHandler.DEFAULT_WALLET_STATUS,
            address: wallet.depositAddress.address,
          },
        ],
        vaultType: FireblocksCwUserAddedEventHandler.WALLET_VAULT_TYPE,
        autoFuel: wallet.vaultAccount.autoFuel ?? false,
        hiddenOnUI: wallet.vaultAccount.hiddenOnUI ?? true,
        name: wallet.vaultAccount.name ?? vaultName,
        customerRefId,
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

  private cleanMetadata(
    metadata: Record<string, string | number | null | undefined>,
  ): Record<string, string | number> | undefined {
    const cleaned = Object.fromEntries(
      Object.entries(metadata).filter(
        ([, value]) =>
          value !== undefined &&
          value !== null &&
          !(typeof value === 'string' && value.trim().length === 0),
      ),
    ) as Record<string, string | number>;

    return Object.keys(cleaned).length ? cleaned : undefined;
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
