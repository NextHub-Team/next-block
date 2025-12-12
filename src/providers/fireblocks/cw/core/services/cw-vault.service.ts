import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import {
  Asset,
  BlockchainResponse,
  CreateAddressResponse,
  ListAssetsResponse,
  ListBlockchainsResponse,
  PaginatedAddressResponse,
  UpdateVaultAccountRequest,
  VaultAccount,
  VaultAccountsPagedResponse,
  VaultAsset,
} from '@fireblocks/ts-sdk';
import { FireblocksCwService } from '../../fireblocks-cw.service';
import {
  FireblocksAssetMetadataDto,
  FireblocksBlockchainDto,
  FireblocksCustodialWalletDto,
  FireblocksDepositAddressDto,
  FireblocksUserPortfolioDto,
  FireblocksVaultAccountDto,
  FireblocksVaultAssetDto,
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

/**
 * Consolidated vault operations combining deposit and portfolio features.
 */
@Injectable()
export class CwVaultService {
  private readonly logger = new Logger(CwVaultService.name);

  constructor(
    @Inject(forwardRef(() => FireblocksCwService))
    private readonly client: FireblocksCwService,
  ) {}

  private get sdk(): ReturnType<FireblocksCwService['getSdk']> {
    this.client.isReady();
    return this.client.getSdk();
  }

  // ---------------------------------------------------------------------------
  // Wallet / deposit flows
  // ---------------------------------------------------------------------------
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
    const sdk = this.sdk;

    const vaultName = await this.client.buildVaultName(
      user.userId,
      user.providerId,
    );
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
    const sdk = this.sdk;
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
    const sdk = this.sdk;

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
    const sdk = this.sdk;

    const response = await sdk.vaults.updateVaultAccount({
      vaultAccountId,
      updateVaultAccountRequest: updates as UpdateVaultAccountRequest,
    });

    return FireblocksCwMapper.toVaultAccountDto(response.data as VaultAccount);
  }

  // ---------------------------------------------------------------------------
  // Portfolio / catalog flows
  // ---------------------------------------------------------------------------
  async getVaultAccount(
    vaultAccountId: string,
  ): Promise<FireblocksVaultAccountDto> {
    const sdk = this.sdk;
    const response = await sdk.vaults.getVaultAccount({ vaultAccountId });
    return FireblocksCwMapper.toVaultAccountDto(response.data as VaultAccount);
  }

  async getVaultAsset(
    vaultAccountId: string,
    assetId: string,
  ): Promise<FireblocksVaultAssetDto> {
    const sdk = this.sdk;
    const response = await sdk.vaults.getVaultAccountAsset({
      vaultAccountId,
      assetId,
    });

    return FireblocksCwMapper.toVaultAssetDto(response.data as VaultAsset);
  }

  async getDepositAddresses(
    vaultAccountId: string,
    assetId: string,
    limit?: number,
    before?: string,
    after?: string,
  ): Promise<FireblocksDepositAddressDto[]> {
    const sdk = this.sdk;
    const response = await sdk.vaults.getVaultAccountAssetAddressesPaginated({
      vaultAccountId,
      assetId,
      limit,
      before,
      after,
    });

    const data = (response.data as PaginatedAddressResponse).addresses || [];
    return data.map((item) => FireblocksCwMapper.toDepositAddressDto(item));
  }

  async listWorkspaceAssets(
    limit?: number,
    cursor?: { before?: string; after?: string },
  ): Promise<FireblocksAssetMetadataDto[]> {
    const sdk = this.sdk;
    const response = await sdk.blockchainsAssets.listAssets({
      pageSize: limit,
      pageCursor: cursor?.before ?? cursor?.after,
    });

    return (response.data as ListAssetsResponse).data.map((asset: Asset) =>
      FireblocksCwMapper.toAssetMetadataDto(asset),
    );
  }

  async getAsset(assetId: string): Promise<FireblocksAssetMetadataDto> {
    const sdk = this.sdk;
    const response = await sdk.blockchainsAssets.getAsset({ id: assetId });
    return FireblocksCwMapper.toAssetMetadataDto(response.data as Asset);
  }

  async listBlockchains(): Promise<FireblocksBlockchainDto[]> {
    const sdk = this.sdk;
    const response = await sdk.blockchainsAssets.listBlockchains();
    return (response.data as ListBlockchainsResponse).data.map(
      (blockchain: BlockchainResponse) =>
        FireblocksCwMapper.toBlockchainDto(blockchain),
    );
  }

  async getBlockchain(blockchainId: string): Promise<FireblocksBlockchainDto> {
    const sdk = this.sdk;
    const response = await sdk.blockchainsAssets.getBlockchain({
      id: blockchainId,
    });

    return FireblocksCwMapper.toBlockchainDto(
      response.data as BlockchainResponse,
    );
  }

  async getVaultAccounts(
    limit?: number,
    before?: string,
    after?: string,
    assetId?: string,
  ): Promise<FireblocksVaultAccountDto[]> {
    const response = await this.sdk.vaults.getPagedVaultAccounts({
      limit,
      before,
      after,
      assetId,
    });

    const accounts =
      (response.data as VaultAccountsPagedResponse).accounts || [];
    return accounts.map((account) =>
      FireblocksCwMapper.toVaultAccountDto(
        account as VaultAccount,
        account.assets as VaultAsset[] | undefined,
      ),
    );
  }

  async getUserPortfolio(
    customerRefId: string,
  ): Promise<FireblocksUserPortfolioDto> {
    const response = await this.sdk.vaults.getPagedVaultAccounts({});
    const accounts =
      (response.data as VaultAccountsPagedResponse).accounts || [];
    const filtered = accounts.filter(
      (account) => (account as VaultAccount).customerRefId === customerRefId,
    );

    this.logger.debug(
      `Resolved ${filtered.length} vault accounts for user ${customerRefId}`,
    );

    return FireblocksCwMapper.toUserPortfolioDto(
      customerRefId,
      filtered as VaultAccount[],
    );
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
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
    params: {
      vaultAccountId: string;
      assetId: string;
      idempotencyKey?: string;
    },
  ): Promise<VaultAsset> {
    try {
      const existing = await sdk.vaults.getVaultAccountAsset({
        vaultAccountId: params.vaultAccountId,
        assetId: params.assetId,
      });

      if (existing?.data) {
        return existing.data as VaultAsset;
      }
    } catch {
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
    } catch {
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
}
