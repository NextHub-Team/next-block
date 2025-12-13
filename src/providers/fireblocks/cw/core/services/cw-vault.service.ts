import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import {
  Asset,
  BlockchainResponse,
  CreateAddressResponse,
  CreateVaultAssetResponse,
  GetMaxSpendableAmountResponse,
  GetUnspentInputsResponse,
  ListAssetsResponse,
  ListBlockchainsResponse,
  PaginatedAddressResponse,
  UpdateVaultAccountAssetAddressRequest,
  UpdateVaultAccountRequest,
  VaultAccount,
  VaultAccountsPagedResponse,
  VaultAsset,
  VaultActionStatus,
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
import {
  CreateVaultWalletRequestDto,
  EnsureVaultWalletOptionsDto,
  FireblocksUserIdentityDto,
  UpdateCustodialWalletDto,
} from '../../dto/fireblocks-vault-requests.dto';
import { FireblocksCwMapper } from '../../helpers/fireblocks-cw.mapper';

export interface CustodialWalletResult {
  vaultAccount: VaultAccount;
  vaultAsset: VaultAsset;
  depositAddress: CreateAddressResponse;
}

export interface VaultAssetAddressesResult {
  vaultAccount: FireblocksVaultAccountDto;
  addresses: Record<string, FireblocksDepositAddressDto>;
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
  /**
   * Ensure a user's vault account, asset wallet, and deposit address exist for a specific asset.
   */
  async ensureUserVaultWalletForAsset(
    user: FireblocksUserIdentityDto,
    assetId: string,
    options?: EnsureVaultWalletOptionsDto,
  ): Promise<FireblocksCustodialWalletDto> {
    const sdk = this.sdk;

    const vaultName = await this.client.buildVaultName(
      user.userId,
      user.providerId,
    );
    const customerRefId = `${user.userId}`;
    const vaultAccount = await this.resolveVaultAccount(sdk, {
      vaultName,
      customerRefId,
      hiddenOnUI: options?.hiddenOnUI ?? true,
      autoFuel: options?.autoFuel ?? false,
      idempotencyKey: options?.idempotencyKey,
    });

    const vaultAsset = await this.resolveVaultAsset(sdk, {
      vaultAccountId: vaultAccount.id as string,
      assetId,
      idempotencyKey: options?.idempotencyKey,
    });

    const depositAddress = await this.resolveDepositAddress(sdk, {
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

  /**
   * Ensure a vault (found by prefix) has deposit addresses for all provided assets.
   */
  async ensureVaultAddressesForAssetsByPrefix(
    vaultNamePrefix: string,
    assetIds: string[],
    options?: {
      addressDescription?: string;
      idempotencyKey?: string;
    },
  ): Promise<VaultAssetAddressesResult> {
    const sdk = this.sdk;
    const paged = await sdk.vaults.getPagedVaultAccounts({
      namePrefix: vaultNamePrefix,
      limit: 1,
    });

    const vaultAccount = paged.data?.accounts?.[0] as VaultAccount | undefined;
    if (!vaultAccount) {
      throw new NotFoundException(
        `No Fireblocks vault account found with prefix ${vaultNamePrefix}`,
      );
    }

    const addresses: Record<string, FireblocksDepositAddressDto> = {};

    for (const assetId of assetIds) {
      await this.resolveVaultAsset(sdk, {
        vaultAccountId: vaultAccount.id as string,
        assetId,
        idempotencyKey: options?.idempotencyKey,
      });

      const depositAddress = await this.resolveDepositAddress(sdk, {
        vaultAccountId: vaultAccount.id as string,
        assetId,
        description: options?.addressDescription,
        customerRefId: vaultAccount.customerRefId ?? vaultAccount.name,
        idempotencyKey: options?.idempotencyKey,
      });

      addresses[assetId] =
        FireblocksCwMapper.toDepositAddressDto(depositAddress);
    }

    return {
      vaultAccount: FireblocksCwMapper.toVaultAccountDto(
        vaultAccount as VaultAccount,
        vaultAccount.assets as VaultAsset[] | undefined,
      ),
      addresses,
    };
  }

  /**
   * Create a new vault account with a single asset wallet and deposit address.
   */
  async createVaultWalletForAsset(
    command: CreateVaultWalletRequestDto,
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

  /**
   * Create a deposit address for a specific vault asset.
   */
  async createVaultDepositAddress(
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

  /**
   * Update top-level vault account properties like name, fuel, and visibility.
   */
  async updateVaultAccountDetails(
    vaultAccountId: string,
    updates: UpdateCustodialWalletDto,
  ): Promise<FireblocksVaultAccountDto> {
    const sdk = this.sdk;

    const response = await sdk.vaults.updateVaultAccount({
      vaultAccountId,
      updateVaultAccountRequest: updates as UpdateVaultAccountRequest,
    });

    return FireblocksCwMapper.toVaultAccountDto(response.data as VaultAccount);
  }

  // ---------------------------------------------------------------------------
  // Vault account utilities
  // ---------------------------------------------------------------------------
  /**
   * Enable an asset wallet for a vault account if it is not yet active.
   */
  async activateVaultAccountAsset(
    vaultAccountId: string,
    assetId: string,
    idempotencyKey?: string,
  ): Promise<CreateVaultAssetResponse> {
    const response = await this.sdk.vaults.activateAssetForVaultAccount({
      vaultAccountId,
      assetId,
      idempotencyKey,
    });

    return response.data as CreateVaultAssetResponse;
  }

  /**
   * Create a legacy-format deposit address (where supported) for a vault asset.
   */
  async createLegacyVaultDepositAddress(
    vaultAccountId: string,
    assetId: string,
    addressId: string,
    idempotencyKey?: string,
  ): Promise<FireblocksDepositAddressDto> {
    const response = await this.sdk.vaults.createLegacyAddress({
      vaultAccountId,
      assetId,
      addressId,
      idempotencyKey,
    });

    return FireblocksCwMapper.toDepositAddressDto(response.data);
  }

  /**
   * Set or change the customer reference id on a vault account.
   */
  async updateVaultAccountCustomerRefId(
    vaultAccountId: string,
    customerRefId: string,
    idempotencyKey?: string,
  ): Promise<VaultActionStatus> {
    const response = await this.sdk.vaults.setVaultAccountCustomerRefId({
      vaultAccountId,
      idempotencyKey,
      setCustomerRefIdRequest: { customerRefId },
    });

    return response.data as VaultActionStatus;
  }

  /**
   * Set or change the customer reference id on a specific deposit address.
   */
  async updateVaultDepositAddressCustomerRefId(
    vaultAccountId: string,
    assetId: string,
    addressId: string,
    customerRefId: string,
    idempotencyKey?: string,
  ): Promise<VaultActionStatus> {
    const response = await this.sdk.vaults.setCustomerRefIdForAddress({
      vaultAccountId,
      assetId,
      addressId,
      idempotencyKey,
      setCustomerRefIdForAddressRequest: { customerRefId },
    });

    return response.data as VaultActionStatus;
  }

  /**
   * Toggle the auto-fuel flag for a vault account.
   */
  async updateVaultAccountAutoFuel(
    vaultAccountId: string,
    autoFuel: boolean,
    idempotencyKey?: string,
  ): Promise<VaultActionStatus> {
    const response = await this.sdk.vaults.setVaultAccountAutoFuel({
      vaultAccountId,
      idempotencyKey,
      setAutoFuelRequest: { autoFuel },
    });

    return response.data as VaultActionStatus;
  }

  /**
   * Hide a vault account from the Fireblocks UI.
   */
  async hideVaultAccountFromUi(
    vaultAccountId: string,
    idempotencyKey?: string,
  ): Promise<VaultActionStatus> {
    const response = await this.sdk.vaults.hideVaultAccount({
      vaultAccountId,
      idempotencyKey,
    });

    return response.data as VaultActionStatus;
  }

  /**
   * Unhide a vault account previously hidden from the Fireblocks UI.
   */
  async unhideVaultAccountFromUi(
    vaultAccountId: string,
    idempotencyKey?: string,
  ): Promise<VaultActionStatus> {
    const response = await this.sdk.vaults.unhideVaultAccount({
      vaultAccountId,
      idempotencyKey,
    });

    return response.data as VaultActionStatus;
  }

  /**
   * Update the metadata/description on a specific deposit address.
   */
  async updateVaultDepositAddress(
    vaultAccountId: string,
    assetId: string,
    addressId: string,
    description?: string,
    idempotencyKey?: string,
  ): Promise<VaultActionStatus> {
    const request: UpdateVaultAccountAssetAddressRequest | undefined =
      description ? { description } : undefined;

    const response = await this.sdk.vaults.updateVaultAccountAssetAddress({
      vaultAccountId,
      assetId,
      addressId,
      updateVaultAccountAssetAddressRequest: request,
      idempotencyKey,
    });

    return response.data as VaultActionStatus;
  }

  /**
   * Refresh and return the latest balance for a vault asset.
   */
  async refreshVaultAccountAssetBalance(
    vaultAccountId: string,
    assetId: string,
    idempotencyKey?: string,
  ): Promise<FireblocksVaultAssetDto> {
    const response = await this.sdk.vaults.updateVaultAccountAssetBalance({
      vaultAccountId,
      assetId,
      idempotencyKey,
    });

    return FireblocksCwMapper.toVaultAssetDto(response.data as VaultAsset);
  }

  /**
   * Retrieve the max spendable amount for a vault asset.
   */
  async fetchVaultAssetMaxSpendableAmount(
    vaultAccountId: string,
    assetId: string,
    manualSigning?: boolean,
  ): Promise<GetMaxSpendableAmountResponse> {
    const response = await this.sdk.vaults.getMaxSpendableAmount({
      vaultAccountId,
      assetId,
      manualSignging: manualSigning,
    });

    return response.data as GetMaxSpendableAmountResponse;
  }

  /**
   * Retrieve unspent inputs for a vault asset (UTXO chains).
   */
  async fetchVaultAssetUnspentInputs(
    vaultAccountId: string,
    assetId: string,
  ): Promise<GetUnspentInputsResponse> {
    const response = await this.sdk.vaults.getUnspentInputs({
      vaultAccountId,
      assetId,
    });

    return response.data as GetUnspentInputsResponse;
  }

  // ---------------------------------------------------------------------------
  // Portfolio / catalog flows
  // ---------------------------------------------------------------------------
  /**
   * Fetch a vault account by id.
   */
  async fetchVaultAccountById(
    vaultAccountId: string,
  ): Promise<FireblocksVaultAccountDto> {
    const sdk = this.sdk;
    const response = await sdk.vaults.getVaultAccount({ vaultAccountId });
    return FireblocksCwMapper.toVaultAccountDto(response.data as VaultAccount);
  }

  /**
   * Fetch a specific asset wallet under a vault account.
   */
  async fetchVaultAccountAsset(
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

  /**
   * List deposit addresses for a vault asset with pagination controls.
   */
  async listVaultDepositAddresses(
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

  /**
   * List available asset metadata for the workspace.
   */
  async listWorkspaceAssetMetadata(
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

  /**
   * Fetch metadata for a specific asset.
   */
  async fetchAssetMetadata(
    assetId: string,
  ): Promise<FireblocksAssetMetadataDto> {
    const sdk = this.sdk;
    const response = await sdk.blockchainsAssets.getAsset({ id: assetId });
    return FireblocksCwMapper.toAssetMetadataDto(response.data as Asset);
  }

  /**
   * List supported blockchains.
   */
  async listSupportedBlockchains(): Promise<FireblocksBlockchainDto[]> {
    const sdk = this.sdk;
    const response = await sdk.blockchainsAssets.listBlockchains();
    return (response.data as ListBlockchainsResponse).data.map(
      (blockchain: BlockchainResponse) =>
        FireblocksCwMapper.toBlockchainDto(blockchain),
    );
  }

  /**
   * Fetch metadata for a specific blockchain.
   */
  async fetchBlockchainMetadata(
    blockchainId: string,
  ): Promise<FireblocksBlockchainDto> {
    const sdk = this.sdk;
    const response = await sdk.blockchainsAssets.getBlockchain({
      id: blockchainId,
    });

    return FireblocksCwMapper.toBlockchainDto(
      response.data as BlockchainResponse,
    );
  }

  /**
   * List vault accounts with optional filters and pagination.
   */
  async listVaultAccounts(
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

  /**
   * Build a portfolio view for a user (by customer ref id).
   */
  async fetchUserPortfolio(
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
  /**
   * Resolve an existing vault account by name or create a new one.
   */
  private async resolveVaultAccount(
    sdk: ReturnType<FireblocksCwService['getSdk']>,
    params: {
      vaultName: string;
      customerRefId: string;
      hiddenOnUI?: boolean;
      autoFuel?: boolean;
      idempotencyKey?: string;
    },
  ): Promise<VaultAccount> {
    const paged = await sdk.vaults.getPagedVaultAccounts({
      namePrefix: params.vaultName,
      limit: 1,
    });

    const existing = paged.data?.accounts?.find(
      (vault) => vault.name === params.vaultName,
    );

    if (existing) {
      if (
        params.customerRefId &&
        existing.customerRefId !== params.customerRefId
      ) {
        await sdk.vaults.setVaultAccountCustomerRefId({
          vaultAccountId: existing.id as string,
          idempotencyKey: params.idempotencyKey,
          setCustomerRefIdRequest: { customerRefId: params.customerRefId },
        });
        existing.customerRefId = params.customerRefId;
      }
      this.logger.log(
        `Reusing existing Fireblocks vault account ${existing.id} for ${params.vaultName}`,
      );
      return existing as VaultAccount;
    }

    const created = await sdk.vaults.createVaultAccount({
      createVaultAccountRequest: {
        name: params.vaultName,
        // Use backend user id as customerRefId; keep name human-readable for Console
        customerRefId: params.customerRefId,
        hiddenOnUI: params.hiddenOnUI ?? true,
        autoFuel: params.autoFuel ?? false,
      },
      idempotencyKey: params.idempotencyKey,
    });

    const vaultAccount = created.data as VaultAccount;
    this.logger.log(
      `Created Fireblocks vault account ${vaultAccount.id} for ${params.vaultName}`,
    );
    return vaultAccount;
  }

  /**
   * Resolve an existing asset wallet for a vault account or create it.
   */
  private async resolveVaultAsset(
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

  /**
   * Resolve an existing deposit address for a vault asset or create one.
   */
  private async resolveDepositAddress(
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
        if (params.customerRefId && !firstAddress.customerRefId) {
          await sdk.vaults.setCustomerRefIdForAddress({
            vaultAccountId: params.vaultAccountId,
            assetId: params.assetId,
            addressId: firstAddress.address as string,
            idempotencyKey: params.idempotencyKey,
            setCustomerRefIdForAddressRequest: {
              customerRefId: params.customerRefId,
            },
          });
          firstAddress.customerRefId = params.customerRefId;
        }
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
