import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import {
  CreateAddressResponse,
  UpdateVaultAccountRequest,
  VaultAccount,
  VaultAsset,
} from '@fireblocks/ts-sdk';
import { FireblocksCwService } from '../../fireblocks-cw.service';
import {
  FireblocksCustodialWalletDto,
  FireblocksDepositAddressDto,
  FireblocksVaultAccountDto,
} from '../../dto/fireblocks-wallet.dto';
import { FireblocksCwMapper } from '../../helpers/fireblocks-cw.mapper';

export interface FireblocksUserIdentity {
  userId: string | number;
  providerId?: string | null;
}

export interface CreateVaultWalletRequest {
  name: string;
  assetId: string;
  customerRefId?: string;
  hiddenOnUI?: boolean;
  addressDescription?: string;
  idempotencyKey?: string;
}

export interface CustodialWalletResult {
  vaultAccount: VaultAccount;
  vaultAsset: VaultAsset;
  depositAddress: CreateAddressResponse;
}

export interface UpdateCustodialWalletCommand {
  name?: string;
  autoFuel?: boolean;
  customerRefId?: string;
  hiddenOnUI?: boolean;
}

@Injectable()
export class CwDepositService {
  private readonly logger = new Logger(CwDepositService.name);

  constructor(
    @Inject(forwardRef(() => FireblocksCwService))
    private readonly client: FireblocksCwService,
  ) {}

  async ensureUserCustodialWallet(
    user: FireblocksUserIdentity,
    assetId: string,
    options?: {
      hiddenOnUI?: boolean;
      autoFuel?: boolean;
      addressDescription?: string;
      idempotencyKey?: string;
    },
  ): Promise<FireblocksCustodialWalletDto> {
    this.ensureEnabled();
    const sdk = this.client.getSdk();

    const vaultName = this.getVaultName(user);
    const customerRefId = vaultName;
    const vaultAccount = await this.findOrCreateVaultAccount(sdk, {
      vaultName,
      customerRefId,
      hiddenOnUI: options?.hiddenOnUI,
      autoFuel: options?.autoFuel,
      idempotencyKey: options?.idempotencyKey,
    });

    const vaultAsset = await this.findOrCreateVaultAsset(sdk, {
      vaultAccountId: vaultAccount.id as string,
      assetId,
      idempotencyKey: options?.idempotencyKey,
    });

    const depositAddress = await this.findOrCreateDepositAddress(sdk, {
      vaultAccountId: vaultAccount.id as string,
      assetId,
      customerRefId,
      description: options?.addressDescription,
      idempotencyKey: options?.idempotencyKey,
    });

    return FireblocksCwMapper.toCustodialWalletDto({
      vaultAccount,
      vaultAsset,
      depositAddress,
    });
  }

  async createCustodialWallet(
    command: CreateVaultWalletRequest,
  ): Promise<FireblocksCustodialWalletDto> {
    this.ensureEnabled();
    const sdk = this.client.getSdk();
    const { name, assetId, customerRefId, hiddenOnUI, addressDescription } =
      command;

    const vaultAccountResponse = await sdk.vaults.createVaultAccount({
      createVaultAccountRequest: {
        name,
        customerRefId,
        hiddenOnUI,
      },
      idempotencyKey: command.idempotencyKey,
    });

    const vaultAccount = vaultAccountResponse.data;
    this.logger.log(`Created Fireblocks vault account ${vaultAccount.id}`);

    const vaultAssetResponse = await sdk.vaults.createVaultAccountAsset({
      vaultAccountId: vaultAccount.id as string,
      assetId,
      idempotencyKey: command.idempotencyKey,
    });

    const vaultAsset = vaultAssetResponse.data as VaultAsset;
    this.logger.log(
      `Created Fireblocks asset wallet ${vaultAsset.id} under vault ${vaultAccount.id}`,
    );

    const depositAddressResponse =
      await sdk.vaults.createVaultAccountAssetAddress({
        vaultAccountId: vaultAccount.id as string,
        assetId,
        createAddressRequest: {
          description: addressDescription,
          customerRefId,
        },
        idempotencyKey: command.idempotencyKey,
      });

    return FireblocksCwMapper.toCustodialWalletDto({
      vaultAccount,
      vaultAsset,
      depositAddress: depositAddressResponse.data,
    });
  }

  async createDepositAddress(
    vaultAccountId: string,
    assetId: string,
    description?: string,
    customerRefId?: string,
  ): Promise<FireblocksDepositAddressDto> {
    this.ensureEnabled();
    const sdk = this.client.getSdk();

    const response = await sdk.vaults.createVaultAccountAssetAddress({
      vaultAccountId,
      assetId,
      createAddressRequest: {
        description,
        customerRefId,
      },
    });

    return FireblocksCwMapper.toDepositAddressDto(response.data);
  }

  async updateCustodialWallet(
    vaultAccountId: string,
    updates: UpdateCustodialWalletCommand,
  ): Promise<FireblocksVaultAccountDto> {
    this.ensureEnabled();
    const sdk = this.client.getSdk();

    const response = await sdk.vaults.updateVaultAccount({
      vaultAccountId,
      updateVaultAccountRequest: updates as UpdateVaultAccountRequest,
    });

    return FireblocksCwMapper.toVaultAccountDto(response.data as VaultAccount);
  }

  private async findOrCreateVaultAccount(
    sdk: ReturnType<FireblocksCwService['getSdk']>,
    params: {
      vaultName: string;
      customerRefId?: string;
      hiddenOnUI?: boolean;
      autoFuel?: boolean;
      idempotencyKey?: string;
    },
  ): Promise<VaultAccount> {
    const paged = await sdk.vaults.getPagedVaultAccounts({
      namePrefix: params.vaultName,
    });

    const existing = paged.data?.accounts?.find(
      (vault) => vault.name === params.vaultName,
    );

    if (existing) {
      this.logger.log(
        `Reusing existing Fireblocks vault account ${existing.id} for ${params.vaultName}`,
      );
      return existing as VaultAccount;
    }

    const created = await sdk.vaults.createVaultAccount({
      createVaultAccountRequest: {
        name: params.vaultName,
        customerRefId: params.customerRefId,
        hiddenOnUI: params.hiddenOnUI,
        autoFuel: params.autoFuel ?? true,
      },
      idempotencyKey: params.idempotencyKey,
    });

    const vaultAccount = created.data as VaultAccount;
    this.logger.log(
      `Created Fireblocks vault account ${vaultAccount.id} for ${params.vaultName}`,
    );
    return vaultAccount;
  }

  private async findOrCreateVaultAsset(
    sdk: ReturnType<FireblocksCwService['getSdk']>,
    params: { vaultAccountId: string; assetId: string; idempotencyKey?: string },
  ): Promise<VaultAsset> {
    try {
      const existing = await sdk.vaults.getVaultAccountAsset({
        vaultAccountId: params.vaultAccountId,
        assetId: params.assetId,
      });

      if (existing?.data) {
        return existing.data as VaultAsset;
      }
    } catch (error) {
      this.logger.warn(
        `Asset ${params.assetId} not found for vault ${params.vaultAccountId}, creating new asset wallet...`,
      );
    }

    const created = await sdk.vaults.createVaultAccountAsset({
      vaultAccountId: params.vaultAccountId,
      assetId: params.assetId,
      idempotencyKey: params.idempotencyKey,
    });

    return created.data as VaultAsset;
  }

  private async findOrCreateDepositAddress(
    sdk: ReturnType<FireblocksCwService['getSdk']>,
    params: {
      vaultAccountId: string;
      assetId: string;
      description?: string;
      customerRefId?: string;
      idempotencyKey?: string;
    },
  ): Promise<CreateAddressResponse> {
    try {
      const existing = await sdk.vaults.getVaultAccountAssetAddressesPaginated({
        vaultAccountId: params.vaultAccountId,
        assetId: params.assetId,
      });

      const firstAddress = existing.data?.addresses?.[0];
      if (firstAddress?.address) {
        return firstAddress as CreateAddressResponse;
      }
    } catch (error) {
      this.logger.warn(
        `No existing deposit address found for ${params.vaultAccountId}/${params.assetId}, creating new address...`,
      );
    }

    const created = await sdk.vaults.createVaultAccountAssetAddress({
      vaultAccountId: params.vaultAccountId,
      assetId: params.assetId,
      createAddressRequest: {
        description: params.description,
        customerRefId: params.customerRefId,
      },
      idempotencyKey: params.idempotencyKey,
    });

    return created.data as CreateAddressResponse;
  }

  private getVaultName(user: FireblocksUserIdentity): string {
    const identifier = user.providerId ?? user.userId;
    return String(identifier);
  }

  private ensureEnabled(): void {
    if (!this.client.isEnabled()) {
      throw new Error('Fireblocks CW client is disabled');
    }
  }
}
