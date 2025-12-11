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

export interface CreateCustodialWalletCommand {
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

  async createCustodialWallet(
    command: CreateCustodialWalletCommand,
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

  private ensureEnabled(): void {
    if (!this.client.isEnabled()) {
      throw new Error('Fireblocks CW client is disabled');
    }
  }
}
