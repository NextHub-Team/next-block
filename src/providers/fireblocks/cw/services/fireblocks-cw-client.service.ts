import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import {
  Asset,
  BlockchainResponse,
  CreateAddressResponse,
  GetMaxSpendableAmountResponse,
  GetUnspentInputsResponse,
  ListAssetsResponse,
  ListBlockchainsResponse,
  PaginatedAddressResponse,
  VaultAccount,
  VaultAccountsPagedResponse,
  VaultAsset,
} from '@fireblocks/ts-sdk';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateVaultWalletRequestDto,
  EnsureVaultWalletOptionsDto,
  UserIdentityDto,
  CreateUserVaultRequestDto,
  CreateUserVaultAssetRequestDto,
  CreateUserVaultAddressRequestDto,
} from '../dto/fireblocks-cw-requests.dto';
import {
  FireblocksAssetMetadataDto,
  FireblocksBlockchainDto,
  FireblocksCustodialWalletDto,
  FireblocksDepositAddressDto,
  FireblocksUserPortfolioDto,
  FireblocksVaultAccountDto,
  FireblocksVaultAssetDto,
} from '../dto/fireblocks-cw-responses.dto';
import { FireblocksCwService } from '../fireblocks-cw.service';
import { FireblocksCwMapper } from '../infrastructure/persistence/relational/mappers/fireblocks-cw.mapper';
import {
  GroupPlainToInstance,
  GroupPlainToInstances,
} from '../../../../utils/transformers/class.transformer';
import { RoleEnum } from '../../../../roles/roles.enum';

/**
 * Consolidated Fireblocks client-facing vault service.
 * Contains all user-facing vault flows; admin-only flows live in FireblocksCwAdminVaultService.
 */
@Injectable()
export class FireblocksCwClientService {
  private readonly logger = new Logger(FireblocksCwClientService.name);

  constructor(
    @Inject(forwardRef(() => FireblocksCwService))
    private readonly fireblocks: FireblocksCwService,
  ) {}

  private get sdk(): ReturnType<FireblocksCwService['getSdk']> {
    this.fireblocks.isReady();
    return this.fireblocks.getSdk();
  }

  // ---------------------------------------------------------------------------
  // High-level user helpers
  // ---------------------------------------------------------------------------
  async createWallet(
    command: CreateVaultWalletRequestDto,
  ): Promise<FireblocksCustodialWalletDto> {
    return this.createVaultWalletForAsset(command);
  }

  async ensureUserWallet(
    user: UserIdentityDto,
    assetId: string,
    options?: EnsureVaultWalletOptionsDto,
  ): Promise<FireblocksCustodialWalletDto> {
    return this.ensureUserVaultWalletForAsset(user, assetId, options);
  }

  async createVaultAccountForUser(
    user: UserIdentityDto,
    body: CreateUserVaultRequestDto,
  ): Promise<FireblocksVaultAccountDto> {
    this.logger.debug(
      `Creating vault account for user=${user.id} (hiddenOnUI=${body.hiddenOnUI ?? true})`,
    );
    const sdk = this.sdk;
    const idempotencyKey = this.ensureIdempotencyKey(body.idempotencyKey);

    const customerRefId = user.socialId ?? `${user.id}`;
    const vaultName = await this.fireblocks.buildVaultName(
      user.id,
      user.socialId ?? `${user.id}`,
    );
    const paged = await sdk.vaults.getPagedVaultAccounts({
      namePrefix: vaultName,
      limit: 1,
    });
    const existing = paged.data?.accounts?.find(
      (a) => (a as any).name === vaultName,
    ) as VaultAccount | undefined;
    if (existing) {
      this.logger.debug(
        `Vault already exists for user=${user.id} (vaultId=${existing.id})`,
      );
      return GroupPlainToInstance(
        FireblocksVaultAccountDto,
        FireblocksCwMapper.toVaultAccountDto(
          existing,
          existing.assets as VaultAsset[] | undefined,
        ),
        [RoleEnum.user, RoleEnum.admin],
      );
    }

    const response = await sdk.vaults.createVaultAccount({
      createVaultAccountRequest: {
        name: vaultName,
        customerRefId,
        hiddenOnUI: body.hiddenOnUI ?? true,
        autoFuel: body.autoFuel ?? false,
      },
      idempotencyKey,
    });

    this.logger.debug(
      `Created vault for user=${user.id} (vaultId=${(response.data as VaultAccount).id})`,
    );

    return GroupPlainToInstance(
      FireblocksVaultAccountDto,
      FireblocksCwMapper.toVaultAccountDto(
        response.data as VaultAccount,
        (response.data as VaultAccount).assets as VaultAsset[] | undefined,
      ),
      [RoleEnum.user, RoleEnum.admin],
    );
  }

  async createVaultAssetForUser(
    user: UserIdentityDto,
    vaultAccountId: string,
    body: CreateUserVaultAssetRequestDto,
  ): Promise<FireblocksVaultAssetDto> {
    this.logger.debug(
      `Ensuring asset for user=${user.id} (vault=${vaultAccountId}, asset=${body.assetId})`,
    );
    const sdk = this.sdk;
    const idempotencyKey = this.ensureIdempotencyKey(body.idempotencyKey);
    const vault = await sdk.vaults.getVaultAccount({ vaultAccountId });
    const vaultData = vault.data as VaultAccount;
    if (vaultData.customerRefId && vaultData.customerRefId !== `${user.id}`) {
      throw new ForbiddenException(
        `Vault ${vaultAccountId} is not associated with the current user`,
      );
    }

    try {
      const existing = await sdk.vaults.getVaultAccountAsset({
        vaultAccountId,
        assetId: body.assetId,
      });
      if (existing?.data) {
        return GroupPlainToInstance(
          FireblocksVaultAssetDto,
          FireblocksCwMapper.toVaultAssetDto(existing.data as VaultAsset),
          [RoleEnum.user, RoleEnum.admin],
        );
      }
    } catch {
      // ignore and create
    }

    const created = await sdk.vaults.createVaultAccountAsset({
      vaultAccountId,
      assetId: body.assetId,
      idempotencyKey,
    });

    this.logger.debug(
      `Created vault asset for user=${user.id} (vault=${vaultAccountId}, asset=${body.assetId})`,
    );

    return GroupPlainToInstance(
      FireblocksVaultAssetDto,
      FireblocksCwMapper.toVaultAssetDto(created.data as VaultAsset),
      [RoleEnum.user, RoleEnum.admin],
    );
  }

  async createVaultWalletAddressForUser(
    user: UserIdentityDto,
    vaultAccountId: string,
    assetId: string,
    body: CreateUserVaultAddressRequestDto,
  ): Promise<FireblocksCustodialWalletDto> {
    this.logger.debug(
      `Ensuring deposit address for user=${user.id} (vault=${vaultAccountId}, asset=${assetId})`,
    );
    const sdk = this.sdk;
    const idempotencyKey = this.ensureIdempotencyKey(body.idempotencyKey);
    const vaultResp = await sdk.vaults.getVaultAccount({ vaultAccountId });
    const vaultAccount = vaultResp.data as VaultAccount;
    const customerRef = user.socialId ?? `${user.id}`;
    if (
      vaultAccount.customerRefId &&
      vaultAccount.customerRefId !== customerRef
    ) {
      throw new ForbiddenException(
        `Vault ${vaultAccountId} is not associated with the current user`,
      );
    }

    const assetResp = await sdk.vaults.getVaultAccountAsset({
      vaultAccountId,
      assetId,
    });
    const vaultAsset = assetResp.data as VaultAsset;

    try {
      const existing = await sdk.vaults.getVaultAccountAssetAddressesPaginated({
        vaultAccountId,
        assetId,
      });
      const first = existing.data?.addresses?.[0];
      if (first?.address) {
        return FireblocksCwMapper.toCustodialWalletDto({
          vaultAccount,
          vaultAsset,
          depositAddress: first,
          roles: [RoleEnum.user, RoleEnum.admin],
        });
      }
    } catch {
      // ignore and create
    }

    const created = await sdk.vaults.createVaultAccountAssetAddress({
      vaultAccountId,
      assetId,
      createAddressRequest: {
        description: body.description,
        customerRefId: vaultAccount.customerRefId ?? customerRef,
      },
      idempotencyKey,
    });

    this.logger.debug(
      `Created deposit address for user=${user.id} (vault=${vaultAccountId}, asset=${assetId})`,
    );

    return FireblocksCwMapper.toCustodialWalletDto({
      vaultAccount,
      vaultAsset,
      depositAddress: created.data,
      roles: [RoleEnum.user, RoleEnum.admin],
    });
  }

  async listUserVaultAccounts(
    user: UserIdentityDto | (string | number),
  ): Promise<FireblocksVaultAccountDto[]> {
    const { id, socialId } =
      typeof user === 'object' ? user : { id: user, socialId: undefined };
    const portfolio = await this.getUserPortfolio(
      id,
      undefined,
      undefined,
      socialId,
    );
    return portfolio.vaultAccounts ?? [];
  }

  async getUserPortfolio(
    userId: string | number,
    namePrefix?: string,
    assetId?: string,
    socialId?: string | null,
  ): Promise<FireblocksUserPortfolioDto> {
    const ref = socialId ?? `${userId}`;
    return this.fetchUserPortfolio(ref, namePrefix, assetId);
  }

  async listUserVaultWallets(
    user: UserIdentityDto | (string | number),
  ): Promise<FireblocksCustodialWalletDto[]> {
    const accounts = await this.listUserVaultAccounts(user);
    const ref =
      typeof user === 'object' ? (user.socialId ?? `${user.id}`) : `${user}`;

    const results: FireblocksCustodialWalletDto[] = [];
    for (const account of accounts) {
      for (const asset of account.assets ?? []) {
        const depositAddress = await this.resolveDepositAddress(this.sdk, {
          vaultAccountId: account.id,
          assetId: asset.assetId ?? asset.id,
          customerRefId: ref,
        });
        results.push(
          FireblocksCwMapper.toCustodialWalletDto({
            vaultAccount: FireblocksCwMapper.toVaultAccountDto(
              account as any,
              account.assets as any,
            ),
            vaultAsset: FireblocksCwMapper.toVaultAssetDto(asset as any),
            depositAddress,
            roles: [RoleEnum.user, RoleEnum.admin],
          }),
        );
      }
    }
    return results;
  }

  async listUserVaultAccountWallets(
    user: UserIdentityDto | (string | number),
    vaultAccountId: string,
  ): Promise<FireblocksCustodialWalletDto[]> {
    const account = await this.getUserVaultAccount(user, vaultAccountId);
    const ref =
      typeof user === 'object' ? (user.socialId ?? `${user.id}`) : `${user}`;
    const results: FireblocksCustodialWalletDto[] = [];
    for (const asset of account.assets ?? []) {
      const depositAddress = await this.resolveDepositAddress(this.sdk, {
        vaultAccountId,
        assetId: asset.assetId ?? asset.id,
        customerRefId: ref,
      });
      results.push(
        FireblocksCwMapper.toCustodialWalletDto({
          vaultAccount: FireblocksCwMapper.toVaultAccountDto(
            account as any,
            account.assets as any,
          ),
          vaultAsset: FireblocksCwMapper.toVaultAssetDto(asset as any),
          depositAddress,
          roles: [RoleEnum.user, RoleEnum.admin],
        }),
      );
    }
    return results;
  }

  async getUserVaultAccountWallet(
    user: UserIdentityDto | (string | number),
    vaultAccountId: string,
    assetId: string,
  ): Promise<FireblocksCustodialWalletDto> {
    const account = await this.getUserVaultAccount(user, vaultAccountId);
    const asset = await this.fetchVaultAccountAsset(vaultAccountId, assetId);
    const ref =
      typeof user === 'object' ? (user.socialId ?? `${user.id}`) : `${user}`;
    const depositAddress = await this.resolveDepositAddress(this.sdk, {
      vaultAccountId,
      assetId,
      customerRefId: ref,
    });
    return FireblocksCwMapper.toCustodialWalletDto({
      vaultAccount: FireblocksCwMapper.toVaultAccountDto(
        account as any,
        account.assets as any,
      ),
      vaultAsset: asset,
      depositAddress,
      roles: [RoleEnum.user, RoleEnum.admin],
    });
  }

  private async getUserVaultAccount(
    user: UserIdentityDto | (string | number),
    vaultAccountId: string,
  ): Promise<FireblocksVaultAccountDto> {
    const account = await this.fetchVaultAccountById(vaultAccountId);
    const normalized =
      typeof user === 'object' ? (user.socialId ?? `${user.id}`) : `${user}`;
    if (account.customerRefId !== normalized) {
      throw new ForbiddenException(
        `Vault account ${vaultAccountId} is not associated with the current user`,
      );
    }
    return account;
  }

  // ---------------------------------------------------------------------------
  // Vault / wallet creation flows (user facing)
  // ---------------------------------------------------------------------------
  /**
   * Ensure a user's vault account, asset wallet, and deposit address exist for a specific asset.
   */
  async ensureUserVaultWalletForAsset(
    user: UserIdentityDto,
    assetId: string,
    options?: EnsureVaultWalletOptionsDto,
  ): Promise<FireblocksCustodialWalletDto> {
    this.logger.debug(
      `Ensuring vault wallet for user=${user.id} (asset=${assetId})`,
    );
    const sdk = this.sdk;
    const idempotencyKey = this.ensureIdempotencyKey(options?.idempotencyKey);

    const customerRefId = user.socialId ?? `${user.id}`;
    const vaultName = await this.fireblocks.buildVaultName(
      user.id,
      user.socialId,
    );
    const vaultAccount = await this.resolveVaultAccount(sdk, {
      vaultName,
      customerRefId,
      hiddenOnUI: options?.hiddenOnUI ?? true,
      autoFuel: options?.autoFuel ?? false,
      idempotencyKey,
    });

    const vaultAsset = await this.resolveVaultAsset(sdk, {
      vaultAccountId: vaultAccount.id as string,
      assetId,
      idempotencyKey,
    });

    const depositAddress = await this.resolveDepositAddress(sdk, {
      vaultAccountId: vaultAccount.id as string,
      assetId,
      customerRefId,
      description: options?.addressDescription,
      idempotencyKey,
    });

    this.logger.debug(
      `Vault wallet ensured for user=${user.id} (vault=${vaultAccount.id}, asset=${assetId})`,
    );

    return GroupPlainToInstance(
      FireblocksCustodialWalletDto,
      FireblocksCwMapper.toCustodialWalletDto({
        vaultAccount,
        vaultAsset,
        depositAddress,
      }),
      [RoleEnum.user, RoleEnum.admin],
    );
  }

  /**
   * Create a new vault account with a single asset wallet and deposit address.
   */
  async createVaultWalletForAsset(
    command: CreateVaultWalletRequestDto,
  ): Promise<FireblocksCustodialWalletDto> {
    this.logger.debug(
      `Creating vault+wallet (name=${command.name}, asset=${command.assetId})`,
    );
    const sdk = this.sdk;
    const idempotencyKey = this.ensureIdempotencyKey(command.idempotencyKey);
    const { name, assetId, customerRefId, hiddenOnUI, addressDescription } =
      command;

    const vaultAccountResponse = await sdk.vaults.createVaultAccount({
      createVaultAccountRequest: {
        name,
        customerRefId,
        hiddenOnUI,
      },
      idempotencyKey,
    });

    const vaultAccount = vaultAccountResponse.data;
    this.logger.log(`Created Fireblocks vault account ${vaultAccount.id}`);

    const vaultAssetResponse = await sdk.vaults.createVaultAccountAsset({
      vaultAccountId: vaultAccount.id as string,
      assetId,
      idempotencyKey,
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
        idempotencyKey,
      });

    return GroupPlainToInstance(
      FireblocksCustodialWalletDto,
      FireblocksCwMapper.toCustodialWalletDto({
        vaultAccount,
        vaultAsset,
        depositAddress: depositAddressResponse.data,
      }),
      [RoleEnum.user, RoleEnum.admin],
    );
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

    return GroupPlainToInstance(
      FireblocksDepositAddressDto,
      FireblocksCwMapper.toDepositAddressDto(response.data),
      [RoleEnum.user, RoleEnum.admin],
    );
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
    return GroupPlainToInstance(
      FireblocksVaultAccountDto,
      FireblocksCwMapper.toVaultAccountDto(response.data as VaultAccount),
      [RoleEnum.user, RoleEnum.admin],
    );
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

    return GroupPlainToInstance(
      FireblocksVaultAssetDto,
      FireblocksCwMapper.toVaultAssetDto(response.data as VaultAsset),
      [RoleEnum.user, RoleEnum.admin],
    );
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
    return GroupPlainToInstances(
      FireblocksDepositAddressDto,
      data.map((item) => FireblocksCwMapper.toDepositAddressDto(item)),
      [RoleEnum.user, RoleEnum.admin],
    );
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

    return GroupPlainToInstances(
      FireblocksAssetMetadataDto,
      (response.data as ListAssetsResponse).data.map((asset: Asset) =>
        FireblocksCwMapper.toAssetMetadataDto(asset),
      ),
      [RoleEnum.user, RoleEnum.admin],
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
    return GroupPlainToInstance(
      FireblocksAssetMetadataDto,
      FireblocksCwMapper.toAssetMetadataDto(response.data as Asset),
      [RoleEnum.user, RoleEnum.admin],
    );
  }

  /**
   * List supported blockchains.
   */
  async listSupportedBlockchains(): Promise<FireblocksBlockchainDto[]> {
    const sdk = this.sdk;
    const response = await sdk.blockchainsAssets.listBlockchains();
    return GroupPlainToInstances(
      FireblocksBlockchainDto,
      (response.data as ListBlockchainsResponse).data.map(
        (blockchain: BlockchainResponse) =>
          FireblocksCwMapper.toBlockchainDto(blockchain),
      ),
      [RoleEnum.user, RoleEnum.admin],
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

    return GroupPlainToInstance(
      FireblocksBlockchainDto,
      FireblocksCwMapper.toBlockchainDto(response.data as BlockchainResponse),
      [RoleEnum.user, RoleEnum.admin],
    );
  }

  /**
   * Build a portfolio view for a user (by customer ref id), optionally filtered by name/asset.
   */
  async fetchUserPortfolio(
    socialId: string,
    namePrefix?: string,
    assetId?: string,
  ): Promise<FireblocksUserPortfolioDto> {
    const vaultNamePrefix =
      namePrefix ?? this.fireblocks.buildVaultNameFromIdentifier(socialId);

    const response = await this.sdk.vaults.getPagedVaultAccounts({
      namePrefix: vaultNamePrefix,
      assetId,
      limit: 1,
    });
    const accounts =
      (response.data as VaultAccountsPagedResponse).accounts || [];
    const filtered = accounts.filter(
      (account) => (account as VaultAccount).customerRefId === socialId,
    );

    this.logger.debug(
      `Resolved ${filtered.length} vault accounts for user ${socialId} (prefix=${vaultNamePrefix}${
        assetId ? `, asset=${assetId}` : ''
      })`,
    );

    return GroupPlainToInstance(
      FireblocksUserPortfolioDto,
      FireblocksCwMapper.toUserPortfolioDto(
        socialId,
        filtered as VaultAccount[],
      ),
      [RoleEnum.user, RoleEnum.admin],
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
    const idempotencyKey = this.ensureIdempotencyKey(params.idempotencyKey);
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
          idempotencyKey,
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
      idempotencyKey,
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
    const idempotencyKey = this.ensureIdempotencyKey(params.idempotencyKey);
    const normalize = (asset: VaultAsset | undefined): VaultAsset => {
      return {
        ...(asset ?? {}),
        id: (asset as { id?: string })?.id ?? params.assetId,
        assetId: (asset as { assetId?: string })?.assetId ?? params.assetId,
      } as VaultAsset;
    };
    try {
      const existing = await sdk.vaults.getVaultAccountAsset({
        vaultAccountId: params.vaultAccountId,
        assetId: params.assetId,
      });

      if (existing?.data) {
        return normalize(existing.data as VaultAsset);
      }
    } catch {
      this.logger.warn(
        `Asset ${params.assetId} not found for vault ${params.vaultAccountId}, creating new asset wallet...`,
      );
    }

    const created = await sdk.vaults.createVaultAccountAsset({
      vaultAccountId: params.vaultAccountId,
      assetId: params.assetId,
      idempotencyKey,
    });

    return normalize(created.data as VaultAsset);
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
    const idempotencyKey = this.ensureIdempotencyKey(params.idempotencyKey);
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
            idempotencyKey,
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
      idempotencyKey,
    });

    return created.data as CreateAddressResponse;
  }

  /**
   * Return provided idempotency key or generate a UUID to guarantee safe retries.
   */
  private ensureIdempotencyKey(key?: string): string {
    if (key && key.trim().length > 0) return key.trim();
    return uuidv4();
  }
}
