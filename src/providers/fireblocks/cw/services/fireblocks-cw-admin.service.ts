import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateMultipleAccountsRequest,
  CreateMultipleDepositAddressesJobStatus,
  CreateMultipleDepositAddressesRequest,
  CreateMultipleVaultAccountsJobStatus,
  CreateVaultAssetResponse,
  GetAPIUsersResponse,
  GetConsoleUsersResponse,
  GetUsersResponse,
  JobCreated,
  CreateAddressResponse,
  UpdateVaultAccountAssetAddressRequest,
  UpdateVaultAccountRequest,
  VaultAccount,
  VaultActionStatus,
  VaultAsset,
} from '@fireblocks/ts-sdk';
import { AllConfigType } from '../../../../config/config.type';
import { FireblocksCwService } from '../fireblocks-cw.service';
import {
  FireblocksSpecialAddressItemDto,
  FireblocksSpecialAddressesResponseDto,
  FireblocksPaginatedAssetWalletResponseDto,
  FireblocksVaultAccountsPageDto,
  FireblocksDepositAddressDto,
  FireblocksUserPortfolioDto,
  FireblocksVaultAccountDto,
  FireblocksVaultAssetDto,
  FireblocksAssetMetadataDto,
  FireblocksAssetCatalogDto,
  FireblocksCustodialWalletDto,
  FireblocksBulkVaultAccountJobDto,
  FireblocksBulkVaultAccountsSyncDto,
} from '../dto/fireblocks-cw-responses.dto';
import {
  AssetWalletsQueryDto,
  VaultAccountsQueryDto,
  SpecialAddressesRequestDto,
  UpdateCustodialWalletDto,
  AssetsCatalogQueryDto,
  CreateAdminVaultAccountRequestDto,
  VaultAccountsByIdsQueryDto,
  BulkCreateVaultAccountsRequestDto,
} from '../dto/fireblocks-cw-requests.dto';
import { AccountsService } from '../../../../accounts/accounts.service';
import {
  AccountProviderName,
  AccountStatus,
  KycStatus,
} from '../../../../accounts/types/account-enum.type';
import { FireblocksCwMapper } from '../helpers/fireblocks-cw.mapper';
import { AbstractCwService } from '../base/abstract-cw.service';
import { FireblocksVaultResponseMapper } from '../infrastructure/persistence/relational/mappers/fireblocks-vault-response.mapper';
import {
  GroupPlainToInstance,
  GroupPlainToInstances,
} from '../../../../utils/transformers/class.transformer';
import { RoleEnum } from '../../../../roles/roles.enum';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../../../../users/users.service';

const BULK_VAULT_CREATE_LIMIT = 100;

/**
 * Consolidated admin service combining vault operations and controller-facing helpers.
 */
@Injectable()
export class FireblocksCwAdminService extends AbstractCwService {
  constructor(
    @Inject(forwardRef(() => FireblocksCwService))
    private readonly fireblocks: FireblocksCwService,
    private readonly accountsService: AccountsService,
    private readonly usersService: UsersService,
    configService: ConfigService<AllConfigType>,
  ) {
    super(FireblocksCwAdminService.name, configService);
  }

  private get sdk(): ReturnType<FireblocksCwService['getSdk']> {
    this.fireblocks.isReady();
    return this.fireblocks.getSdk();
  }

  // ---------------------------------------------------------------------------
  // Controller-facing helpers (previously wrappers)
  // ---------------------------------------------------------------------------
  async getUserWallets(userId: string): Promise<FireblocksUserPortfolioDto> {
    return this.fetchUserPortfolioByCustomerRefId(userId);
  }

  listAssetWallets(
    query: AssetWalletsQueryDto,
  ): Promise<FireblocksPaginatedAssetWalletResponseDto> {
    return this.listAssetWalletsPaged(
      query.limit,
      query.before,
      query.after,
      query.assetId,
    );
  }

  createSpecialAddresses(
    body: SpecialAddressesRequestDto,
  ): Promise<FireblocksSpecialAddressesResponseDto> {
    return this.createSpecialAddressesForAssets(body);
  }

  listVaultAccounts(
    query: VaultAccountsQueryDto,
  ): Promise<FireblocksVaultAccountsPageDto> {
    return this.listVaultAccountsPaged(
      query.limit,
      query.before,
      query.after,
      query.assetId,
      query.namePrefix,
    );
  }

  async createVaultAccount(
    command: CreateAdminVaultAccountRequestDto,
  ): Promise<FireblocksVaultAccountDto> {
    this.guardEnabledAndLog();
    this.logger.debug(
      `Creating vault account (name=${command.name}, customerRefId=${command.customerRefId})`,
    );
    const idempotencyKey = this.ensureIdempotencyKey(command.idempotencyKey);

    const response = await this.sdk.vaults.createVaultAccount({
      createVaultAccountRequest: {
        name: command.name,
        customerRefId: command.customerRefId,
        hiddenOnUI: command.hiddenOnUI ?? true,
        autoFuel: command.autoFuel ?? false,
      },
      idempotencyKey,
    });

    const vaultAccountDto =
      FireblocksVaultResponseMapper.vaultAccount(response);

    await this.createAccountForVault(vaultAccountDto, {
      customerRefId: command.customerRefId,
      name: command.name,
      referenceId: idempotencyKey,
    });

    this.logger.debug(
      `Vault account created and synced (id=${vaultAccountDto.id})`,
    );

    return vaultAccountDto;
  }

  fetchVaultAccount(
    vaultAccountId: string,
  ): Promise<FireblocksVaultAccountDto> {
    return this.fetchVaultAccountById(vaultAccountId);
  }

  fetchVaultAsset(
    vaultAccountId: string,
    assetId: string,
  ): Promise<FireblocksVaultAssetDto> {
    return this.fetchVaultAccountAsset(vaultAccountId, assetId);
  }

  // ---------------------------------------------------------------------------
  // Vault account operations
  // ---------------------------------------------------------------------------
  /**
   * List vault accounts with pagination and optional filters (assetId, namePrefix/socialId).
   */
  async listVaultAccountsPaged(
    limit?: number,
    before?: string,
    after?: string,
    assetId?: string,
    namePrefix?: string,
  ): Promise<FireblocksVaultAccountsPageDto> {
    this.guardEnabledAndLog();
    const response = await this.sdk.vaults.getPagedVaultAccounts({
      limit,
      before,
      after,
      assetId,
      namePrefix,
    });
    return FireblocksVaultResponseMapper.vaultAccountsPage(response);
  }

  /**
   * Fetch a vault account by id.
   */
  async fetchVaultAccountById(
    vaultAccountId: string,
  ): Promise<FireblocksVaultAccountDto> {
    this.guardEnabledAndLog();
    const response = await this.sdk.vaults.getVaultAccount({ vaultAccountId });
    return FireblocksVaultResponseMapper.vaultAccount(response);
  }

  /**
   * Fetch multiple vault accounts by id, syncing each into the local DB.
   * Only accounts that exist in Fireblocks are returned.
   */
  async fetchVaultAccountsByIds(
    query: VaultAccountsByIdsQueryDto,
  ): Promise<FireblocksBulkVaultAccountsSyncDto> {
    this.guardEnabledAndLog();
    this.logger.debug(
      `Fetching vault accounts by ids (count=${query.ids?.length ?? 0})`,
    );
    const ids = Array.from(new Set(query.ids ?? [])).filter(
      (id) => typeof id === 'string' && id.trim().length > 0,
    );

    const results: FireblocksVaultAccountDto[] = [];
    const missingIds: string[] = [];

    for (const id of ids) {
      try {
        const response = await this.sdk.vaults.getVaultAccount({
          vaultAccountId: id,
        });
        const vaultAccountDto =
          FireblocksVaultResponseMapper.vaultAccount(response);

        await this.createAccountForVault(vaultAccountDto, {
          customerRefId: vaultAccountDto.customerRefId,
          name: vaultAccountDto.name,
          referenceId: undefined,
        });

        results.push(vaultAccountDto);
      } catch (error: unknown) {
        this.logger.warn(
          `Vault account ${id} not found or not accessible; skipping sync`,
        );
        missingIds.push(id);
        if (error instanceof Error) {
          this.logger.debug(error.message);
        }
      }
    }

    if (!results.length && missingIds.length) {
      throw new NotFoundException(
        `No Fireblocks vault accounts found for provided ids`,
      );
    }

    return GroupPlainToInstance(
      FireblocksBulkVaultAccountsSyncDto,
      { accounts: results, missingIds },
      [RoleEnum.admin],
    );
  }

  /**
   * Create Fireblocks vault accounts for multiple users via bulk job (no immediate DB sync).
   * Fireblocks processes the job asynchronously; DB sync happens when fetching by ids.
   */
  async bulkCreateVaultAccountsForUsers(
    command: BulkCreateVaultAccountsRequestDto,
  ): Promise<FireblocksBulkVaultAccountJobDto> {
    this.guardEnabledAndLog();
    const userRequests = (command.users ?? []).filter(
      (user) => !!user?.socialId && !!user?.email,
    );

    if (!userRequests.length) {
      throw new BadRequestException(
        'At least one user (socialId + email) is required',
      );
    }

    if (!command.baseAssetIds?.length) {
      throw new BadRequestException('At least one baseAssetId is required');
    }

    const uniqueRequests = Array.from(
      new Map(
        userRequests
          .map((user) => [user.socialId.trim(), user] as const)
          .filter(([socialId]) => !!socialId),
      ).values(),
    );

    const socialIds = uniqueRequests.map((request) => request.socialId.trim());
    if (socialIds.length > BULK_VAULT_CREATE_LIMIT) {
      throw new BadRequestException(
        `Maximum ${BULK_VAULT_CREATE_LIMIT} users can be processed per request`,
      );
    }

    const users = await this.usersService.findBySocialIds(socialIds);
    const usersBySocialId = new Map(
      users
        .filter((user) => !!user.socialId)
        .map((user) => [user.socialId as string, user]),
    );

    const missingSocialId = socialIds.find(
      (socialId) => !usersBySocialId.has(socialId),
    );
    if (typeof missingSocialId !== 'undefined') {
      throw new NotFoundException(
        `User with socialId ${missingSocialId} not found`,
      );
    }

    for (const request of uniqueRequests) {
      const user = usersBySocialId.get(request.socialId.trim());
      if (!user?.email) {
        throw new BadRequestException(
          `User ${user?.id ?? request.socialId} is missing email; cannot create vault`,
        );
      }

      if (
        request.email &&
        user.email &&
        request.email.toLowerCase() !== user.email.toLowerCase()
      ) {
        throw new BadRequestException(
          `Email mismatch for socialId ${request.socialId}: provided ${request.email}, expected ${user.email}`,
        );
      }
    }

    const names = await Promise.all(
      uniqueRequests.map(async (request) => {
        const user = usersBySocialId.get(request.socialId.trim());
        if (!user) {
          throw new NotFoundException(
            `User with socialId ${request.socialId} not found`,
          );
        }

        return this.fireblocks.buildVaultName(user.id, user.socialId);
      }),
    );

    const idempotencyKey = this.ensureIdempotencyKey();
    const job = await this.bulkCreateVaultAccounts(
      {
        count: names.length,
        baseAssetIds: command.baseAssetIds,
        names,
      },
      idempotencyKey,
    );

    if (!job?.jobId) {
      throw new ServiceUnavailableException(
        'Fireblocks did not return a job id for bulk vault creation',
      );
    }

    return GroupPlainToInstance(
      FireblocksBulkVaultAccountJobDto,
      {
        jobId: job.jobId,
        requested: names.length,
        names,
        baseAssetIds: command.baseAssetIds,
      },
      [RoleEnum.admin],
    );
  }

  /**
   * Fetch a specific asset wallet under a vault account.
   */
  async fetchVaultAccountAsset(
    vaultAccountId: string,
    assetId: string,
  ): Promise<FireblocksVaultAssetDto> {
    this.guardEnabledAndLog();
    const response = await this.sdk.vaults.getVaultAccountAsset({
      vaultAccountId,
      assetId,
    });

    return FireblocksVaultResponseMapper.vaultAsset(response);
  }

  /**
   * Build a portfolio of vault accounts for a user by customer ref id.
   */
  async fetchUserPortfolioByCustomerRefId(
    customerRefId: string,
  ): Promise<FireblocksUserPortfolioDto> {
    const paged = await this.listVaultAccountsPaged(
      undefined,
      undefined,
      undefined,
      undefined,
      customerRefId,
    );
    const accounts = (paged.accounts || []).filter(
      (account) => account.customerRefId === customerRefId,
    );

    const dto = FireblocksCwMapper.toUserPortfolioDto(
      customerRefId,
      accounts as VaultAccount[],
    );

    return GroupPlainToInstance(FireblocksUserPortfolioDto, dto, [
      RoleEnum.admin,
    ]);
  }

  /**
   * Update top-level vault account properties like name, fuel, and visibility.
   */
  async updateVaultAccountDetails(
    vaultAccountId: string,
    updates: UpdateCustodialWalletDto,
  ): Promise<FireblocksVaultAccountDto> {
    this.guardEnabledAndLog();
    const response = await this.sdk.vaults.updateVaultAccount({
      vaultAccountId,
      updateVaultAccountRequest: updates as UpdateVaultAccountRequest,
    });

    return FireblocksCwMapper.toVaultAccountDto(response.data as VaultAccount);
  }

  /**
   * Set or change the customer reference id on a vault account.
   */
  async updateVaultAccountCustomerRefId(
    vaultAccountId: string,
    customerRefId: string,
    idempotencyKey?: string,
  ): Promise<VaultActionStatus> {
    this.guardEnabledAndLog();
    const response = await this.sdk.vaults.setVaultAccountCustomerRefId({
      vaultAccountId,
      idempotencyKey,
      setCustomerRefIdRequest: { customerRefId },
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
    this.guardEnabledAndLog();
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
    this.guardEnabledAndLog();
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
    this.guardEnabledAndLog();
    const response = await this.sdk.vaults.unhideVaultAccount({
      vaultAccountId,
      idempotencyKey,
    });

    return response.data as VaultActionStatus;
  }

  // ---------------------------------------------------------------------------
  // Asset wallet operations
  // ---------------------------------------------------------------------------
  /**
   * List asset wallets across vault accounts with optional asset filter.
   */
  async listAssetWalletsPaged(
    limit?: number,
    before?: string,
    after?: string,
    assetId?: string,
  ): Promise<FireblocksPaginatedAssetWalletResponseDto> {
    this.guardEnabledAndLog();
    const response = await this.sdk.vaults.getAssetWallets({
      assetId,
      limit,
      before,
      after,
    });

    return FireblocksVaultResponseMapper.assetWalletsPage(response);
  }

  /**
   * Ensure a vault (found by prefix) has deposit addresses for all provided assets.
   */
  async ensureVaultAddressesForAssetsByPrefix(
    vaultNamePrefix: string,
    assetIds: string[],
    options?: { addressDescription?: string; idempotencyKey?: string },
  ): Promise<{
    vaultAccount: FireblocksVaultAccountDto;
    addresses: Record<string, FireblocksDepositAddressDto>;
  }> {
    this.guardEnabledAndLog();
    this.logger.debug(
      `Ensuring vault addresses by prefix=${vaultNamePrefix} for assets=${assetIds.join(',')}`,
    );
    const paged = await this.sdk.vaults.getPagedVaultAccounts({
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
      await this.ensureVaultAsset(
        vaultAccount.id as string,
        assetId,
        options?.idempotencyKey,
      );

      const depositAddress =
        await this.sdk.vaults.createVaultAccountAssetAddress({
          vaultAccountId: vaultAccount.id as string,
          assetId,
          createAddressRequest: {
            description: options?.addressDescription,
            customerRefId: vaultAccount.customerRefId ?? vaultAccount.name,
          },
          idempotencyKey: options?.idempotencyKey,
        });

      addresses[assetId] = FireblocksCwMapper.toDepositAddressDto(
        depositAddress.data,
      );
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
   * Enable an asset wallet for a vault account if it is not yet active.
   */
  async activateVaultAccountAsset(
    vaultAccountId: string,
    assetId: string,
    idempotencyKey?: string,
  ): Promise<CreateVaultAssetResponse> {
    this.guardEnabledAndLog();
    const response = await this.sdk.vaults.activateAssetForVaultAccount({
      vaultAccountId,
      assetId,
      idempotencyKey,
    });

    return response.data as CreateVaultAssetResponse;
  }

  /**
   * Refresh and return the latest balance for a vault asset.
   */
  async refreshVaultAccountAssetBalance(
    vaultAccountId: string,
    assetId: string,
    idempotencyKey?: string,
  ): Promise<FireblocksVaultAssetDto> {
    this.guardEnabledAndLog();
    const response = await this.sdk.vaults.updateVaultAccountAssetBalance({
      vaultAccountId,
      assetId,
      idempotencyKey,
    });

    return FireblocksCwMapper.toVaultAssetDto(response.data as VaultAsset);
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
    this.guardEnabledAndLog();
    const response = await this.sdk.vaults.createLegacyAddress({
      vaultAccountId,
      assetId,
      addressId,
      idempotencyKey,
    });

    return FireblocksCwMapper.toDepositAddressDto(response.data);
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
    this.guardEnabledAndLog();
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
   * Set or change the customer reference id on a specific deposit address.
   */
  async updateVaultDepositAddressCustomerRefId(
    vaultAccountId: string,
    assetId: string,
    addressId: string,
    customerRefId: string,
    idempotencyKey?: string,
  ): Promise<VaultActionStatus> {
    this.guardEnabledAndLog();
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
   * Create special deposit addresses for a set of assets in a vault account.
   */
  async createSpecialAddressesForAssets(
    request: SpecialAddressesRequestDto,
  ): Promise<FireblocksSpecialAddressesResponseDto> {
    this.guardEnabledAndLog();
    this.logger.debug(
      `Creating special addresses (vault=${request.vaultAccountId}, assets=${request.assets.length})`,
    );

    const {
      assets,
      vaultAccountId,
      customerRefId,
      addressDescription,
      idempotencyKey,
    } = request;

    if (!assets?.length) {
      throw new BadRequestException(
        'At least one asset is required to create special addresses',
      );
    }

    const vaultAccountResponse = await this.sdk.vaults.getVaultAccount({
      vaultAccountId,
    });

    const vaultAccount = vaultAccountResponse.data as VaultAccount;
    const vaultAccountDto = FireblocksCwMapper.toVaultAccountDto(
      vaultAccount,
      vaultAccount.assets as VaultAsset[] | undefined,
    );

    const createdAddresses: FireblocksSpecialAddressItemDto[] = [];

    for (const asset of assets) {
      await this.ensureVaultAsset(
        vaultAccountId,
        asset.assetId,
        idempotencyKey,
      );

      const depositAddress =
        await this.sdk.vaults.createVaultAccountAssetAddress({
          vaultAccountId,
          assetId: asset.assetId,
          createAddressRequest: {
            description: asset.description ?? addressDescription,
            customerRefId,
          },
          idempotencyKey,
        });

      createdAddresses.push({
        assetId: asset.assetId,
        depositAddress: FireblocksCwMapper.toDepositAddressDto(
          depositAddress.data,
        ),
      });
    }

    return GroupPlainToInstance(
      FireblocksSpecialAddressesResponseDto,
      {
        vaultAccount: vaultAccountDto,
        addresses: createdAddresses,
      },
      [RoleEnum.admin],
    );
  }

  /**
   * List supported assets for the workspace (with environment).
   */
  async listSupportedAssets(
    query: AssetsCatalogQueryDto,
  ): Promise<FireblocksAssetCatalogDto> {
    this.guardEnabledAndLog();
    const response = await this.sdk.blockchainsAssets.listAssets({
      pageSize: query.limit,
      pageCursor: query.cursor,
    });

    const assets = GroupPlainToInstances(
      FireblocksAssetMetadataDto,
      (response.data?.data as any[])?.map((a: any) =>
        FireblocksCwMapper.toAssetMetadataDto(a),
      ) ?? [],
      [RoleEnum.admin],
    );

    return GroupPlainToInstance(
      FireblocksAssetCatalogDto,
      {
        envType: this.fireblocks.getOptions().envType,
        assets,
      },
      [RoleEnum.admin],
    );
  }

  /**
   * Fetch metadata for a specific asset.
   */
  async fetchAssetMetadata(
    assetId: string,
  ): Promise<FireblocksAssetMetadataDto> {
    this.guardEnabledAndLog();
    const response = await this.sdk.blockchainsAssets.getAsset({ id: assetId });
    return GroupPlainToInstance(
      FireblocksAssetMetadataDto,
      FireblocksCwMapper.toAssetMetadataDto(response.data as any),
      [RoleEnum.admin],
    );
  }

  // ---------------------------------------------------------------------------
  // Bulk vault wallet orchestration
  // ---------------------------------------------------------------------------
  /**
   * Ensure asset wallets and deposit addresses exist for multiple vault accounts.
   */
  async bulkCreateVaultAssetsAndDepositAddresses(
    requests: Array<{
      vaultAccountId: string;
      assetId: string;
      addressDescription?: string;
      customerRefId?: string;
      idempotencyKey?: string;
    }>,
  ): Promise<FireblocksCustodialWalletDto[]> {
    this.guardEnabledAndLog();
    this.logger.debug(
      `Bulk ensure assets+addresses (count=${requests?.length ?? 0})`,
    );

    if (!requests?.length) {
      throw new BadRequestException(
        'At least one vault account and asset pair is required',
      );
    }

    const vaultCache = new Map<string, VaultAccount>();
    const results: FireblocksCustodialWalletDto[] = [];

    for (const request of requests) {
      const cachedVault = vaultCache.get(request.vaultAccountId);
      const vaultAccount =
        cachedVault ??
        ((
          await this.sdk.vaults.getVaultAccount({
            vaultAccountId: request.vaultAccountId,
          })
        )?.data as VaultAccount);

      if (!vaultAccount) {
        throw new NotFoundException(
          `Vault account ${request.vaultAccountId} could not be resolved`,
        );
      }

      vaultCache.set(request.vaultAccountId, vaultAccount);
      const idempotencyKey = this.ensureIdempotencyKey(request.idempotencyKey);

      const vaultAsset = await this.ensureVaultAsset(
        request.vaultAccountId,
        request.assetId,
        idempotencyKey,
      );

      const depositAddress = await this.getOrCreateDepositAddress({
        vaultAccountId: request.vaultAccountId,
        assetId: request.assetId,
        customerRefId:
          request.customerRefId ??
          vaultAccount.customerRefId ??
          vaultAccount.name,
        description: request.addressDescription,
        idempotencyKey,
        createIfMissing: true,
      });

      if (!depositAddress) {
        throw new BadRequestException(
          `Failed to create deposit address for vault ${request.vaultAccountId} (${request.assetId})`,
        );
      }

      results.push(
        FireblocksCwMapper.toCustodialWalletDto({
          vaultAccount,
          vaultAsset,
          depositAddress,
        }),
      );
    }

    return GroupPlainToInstances(FireblocksCustodialWalletDto, results, [
      RoleEnum.admin,
    ]);
  }

  /**
   * Fetch existing vault wallets and their primary deposit addresses in bulk.
   */
  async bulkFetchVaultAssetsWithAddresses(
    requests: Array<{ vaultAccountId: string; assetId: string }>,
  ): Promise<FireblocksCustodialWalletDto[]> {
    this.guardEnabledAndLog();
    this.logger.debug(
      `Bulk fetch assets+addresses (count=${requests?.length ?? 0})`,
    );

    if (!requests?.length) {
      throw new BadRequestException(
        'At least one vault account and asset pair is required',
      );
    }

    const vaultCache = new Map<string, VaultAccount>();
    const results: FireblocksCustodialWalletDto[] = [];

    for (const request of requests) {
      const cachedVault = vaultCache.get(request.vaultAccountId);
      const vaultAccount =
        cachedVault ??
        ((
          await this.sdk.vaults.getVaultAccount({
            vaultAccountId: request.vaultAccountId,
          })
        )?.data as VaultAccount);

      if (!vaultAccount) {
        throw new NotFoundException(
          `Vault account ${request.vaultAccountId} could not be resolved`,
        );
      }

      vaultCache.set(request.vaultAccountId, vaultAccount);

      const vaultAssetResponse = await this.sdk.vaults.getVaultAccountAsset({
        vaultAccountId: request.vaultAccountId,
        assetId: request.assetId,
      });
      const vaultAsset = vaultAssetResponse.data as VaultAsset;

      const depositAddress = await this.getOrCreateDepositAddress({
        vaultAccountId: request.vaultAccountId,
        assetId: request.assetId,
      });

      if (!depositAddress) {
        throw new NotFoundException(
          `No deposit address found for vault ${request.vaultAccountId} and asset ${request.assetId}`,
        );
      }

      results.push(
        FireblocksCwMapper.toCustodialWalletDto({
          vaultAccount,
          vaultAsset,
          depositAddress,
        }),
      );
    }

    return GroupPlainToInstances(FireblocksCustodialWalletDto, results, [
      RoleEnum.admin,
    ]);
  }

  // ---------------------------------------------------------------------------
  // Bulk jobs
  // ---------------------------------------------------------------------------
  /**
   * Start a bulk vault account creation job.
   */
  async bulkCreateVaultAccounts(
    request: CreateMultipleAccountsRequest,
    idempotencyKey?: string,
  ): Promise<JobCreated> {
    this.guardEnabledAndLog();
    const response = await this.sdk.vaults.createMultipleAccounts({
      createMultipleAccountsRequest: request,
      idempotencyKey,
    });

    return response.data as JobCreated;
  }

  /**
   * Get status/results for a bulk vault account creation job.
   */
  async fetchBulkCreateVaultAccountsJobStatus(
    jobId: string,
  ): Promise<CreateMultipleVaultAccountsJobStatus> {
    this.guardEnabledAndLog();
    const response =
      await this.sdk.vaults.getCreateMultipleVaultAccountsJobStatus({ jobId });
    return response.data as CreateMultipleVaultAccountsJobStatus;
  }

  /**
   * Start a bulk deposit address creation job.
   */
  async bulkCreateDepositAddresses(
    request: CreateMultipleDepositAddressesRequest,
    idempotencyKey?: string,
  ): Promise<JobCreated> {
    this.guardEnabledAndLog();
    const response = await this.sdk.vaults.createMultipleDepositAddresses({
      createMultipleDepositAddressesRequest: request,
      idempotencyKey,
    });

    return response.data as JobCreated;
  }

  /**
   * Get status/results for a bulk deposit address creation job.
   */
  async fetchBulkCreateDepositAddressesJobStatus(
    jobId: string,
  ): Promise<CreateMultipleDepositAddressesJobStatus> {
    this.guardEnabledAndLog();
    const response =
      await this.sdk.vaults.getCreateMultipleDepositAddressesJobStatus({
        jobId,
      });

    return response.data as CreateMultipleDepositAddressesJobStatus;
  }

  // ---------------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------------
  /**
   * List all workspace users (Admin API key required).
   */
  async listUsers(): Promise<GetUsersResponse> {
    this.guardEnabledAndLog();
    const response = await this.sdk.users.getUsers();
    return response.data as GetUsersResponse;
  }

  /**
   * List all API users (Admin API key required).
   */
  async listApiUsers(): Promise<GetAPIUsersResponse> {
    this.guardEnabledAndLog();
    const response = await this.sdk.apiUser.getApiUsers();
    return response.data as GetAPIUsersResponse;
  }

  /**
   * List all console users (Admin API key required).
   */
  async listConsoleUsers(): Promise<GetConsoleUsersResponse> {
    this.guardEnabledAndLog();
    const response = await this.sdk.consoleUser.getConsoleUsers();
    return response.data as GetConsoleUsersResponse;
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  private async createAccountForVault(
    vaultAccount: FireblocksVaultAccountDto,
    params: {
      customerRefId?: string | number;
      name?: string;
      referenceId?: string;
      email?: string | null;
      socialId?: string | null;
    },
  ): Promise<void> {
    if (!params.customerRefId) {
      this.logger.warn(
        `Account sync skipped for vault ${vaultAccount.id}: missing customerRefId`,
      );
      return;
    }

    const metadata = this.buildAccountMetadata(vaultAccount, params);
    try {
      await this.accountsService.upsertByProviderAccountId({
        user: { id: params.customerRefId },
        KycStatus: KycStatus.VERIFIED,
        label: 'cw',
        metadata,
        status: AccountStatus.ACTIVE,
        providerAccountId: vaultAccount.id as string,
        providerName: AccountProviderName.FIREBLOCKS,
      });
    } catch (error: unknown) {
      this.logger.error(
        `Failed to sync account for vault ${vaultAccount.id}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  private buildAccountMetadata(
    vaultAccount: FireblocksVaultAccountDto,
    params: {
      customerRefId?: string | number;
      name?: string;
      referenceId?: string;
      email?: string | null;
      socialId?: string | null;
    },
  ): Record<string, unknown> | undefined {
    const metadata = {
      customerRefId: params.customerRefId ?? vaultAccount.customerRefId,
      name: vaultAccount.name ?? params.name,
      referenceId: params.referenceId,
      email: params.email,
      socialId: params.socialId,
    };

    const cleaned = Object.fromEntries(
      Object.entries(metadata).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    );

    return Object.keys(cleaned).length ? cleaned : undefined;
  }

  private async getOrCreateDepositAddress(params: {
    vaultAccountId: string;
    assetId: string;
    customerRefId?: string;
    description?: string;
    idempotencyKey?: string;
    createIfMissing?: boolean;
  }): Promise<CreateAddressResponse | undefined> {
    try {
      const response =
        await this.sdk.vaults.getVaultAccountAssetAddressesPaginated({
          vaultAccountId: params.vaultAccountId,
          assetId: params.assetId,
          limit: 1,
        });

      const existing = response.data?.addresses?.[0];
      if (existing?.address) {
        return existing as CreateAddressResponse;
      }
    } catch (error: unknown) {
      this.logger.warn(
        `Unable to fetch deposit addresses for ${params.vaultAccountId}/${params.assetId}`,
      );
      if (error instanceof Error) {
        this.logger.debug(error.message);
      }
    }

    if (!params.createIfMissing) {
      return undefined;
    }

    const created = await this.sdk.vaults.createVaultAccountAssetAddress({
      vaultAccountId: params.vaultAccountId,
      assetId: params.assetId,
      createAddressRequest: {
        customerRefId: params.customerRefId,
        description: params.description,
      },
      idempotencyKey: params.idempotencyKey,
    });

    return created.data as CreateAddressResponse;
  }

  private async ensureVaultAsset(
    vaultAccountId: string,
    assetId: string,
    idempotencyKey?: string,
  ): Promise<VaultAsset> {
    try {
      const response = await this.sdk.vaults.getVaultAccountAsset({
        vaultAccountId,
        assetId,
      });
      if (response?.data) {
        return response.data as VaultAsset;
      }
    } catch (error: unknown) {
      this.logger.warn(
        `Vault asset ${assetId} not found for account ${vaultAccountId}; creating wallet...`,
      );
      if (error instanceof Error) {
        this.logger.debug(error.message);
      }
    }

    const created = await this.sdk.vaults.createVaultAccountAsset({
      vaultAccountId,
      assetId,
      idempotencyKey,
    });

    return created.data as VaultAsset;
  }

  /**
   * Return provided idempotency key or generate a UUID to guard against retries.
   */
  private ensureIdempotencyKey(key?: string): string {
    if (key && key.trim().length > 0) {
      return key.trim();
    }
    return uuidv4();
  }
}
