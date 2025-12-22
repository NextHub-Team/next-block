import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateMultipleAccountsRequest,
  CreateMultipleDepositAddressesJobStatus,
  CreateMultipleDepositAddressesRequest,
  CreateMultipleVaultAccountsJobStatus,
  CreateVaultAssetResponse,
  JobCreated,
  UpdateVaultAccountAssetAddressRequest,
  UpdateVaultAccountRequest,
  VaultAccount,
  VaultActionStatus,
  VaultAsset,
} from '@fireblocks/ts-sdk';
import { AllConfigType } from '../../../../config/config.type';
import { FireblocksCwService } from '../fireblocks-cw.service';
import { FireblocksCwWorkflowService } from './fireblocks-cw-workflow.service';
import {
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
import { FireblocksCwMapper } from '../helpers/fireblocks-cw.mapper';
import { AbstractCwService } from '../base/abstract-cw.service';
import { FireblocksVaultResponseMapper } from '../infrastructure/persistence/relational/mappers/fireblocks-vault-response.mapper';
import {
  GroupPlainToInstance,
  GroupPlainToInstances,
} from '../../../../utils/transformers/class.transformer';
import { RoleEnum } from '../../../../roles/roles.enum';

/**
 * Consolidated admin service combining vault operations and controller-facing helpers.
 */
@Injectable()
export class FireblocksCwAdminService extends AbstractCwService {
  constructor(
    @Inject(forwardRef(() => FireblocksCwService))
    private readonly fireblocks: FireblocksCwService,
    private readonly workflow: FireblocksCwWorkflowService,
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
    return this.workflow.buildUserPortfolioWorkflow(userId);
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
    return this.workflow.createSpecialAddressesWorkflow(body);
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
    return this.workflow.createVaultAccountWorkflow(command);
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

  /**
   * Ensure a vault account has an asset wallet and deposit address.
   */
  async ensureVaultWallet(
    vaultAccountId: string,
    assetId: string,
  ): Promise<FireblocksCustodialWalletDto> {
    return this.workflow.ensureVaultWalletWorkflow(vaultAccountId, assetId);
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
    return this.workflow.fetchVaultAccountsByIdsWorkflow(query);
  }

  /**
   * Create Fireblocks vault accounts for multiple users via bulk job (no immediate DB sync).
   * Fireblocks processes the job asynchronously; DB sync happens when fetching by ids.
   */
  async bulkCreateVaultAccountsForUsers(
    command: BulkCreateVaultAccountsRequestDto,
  ): Promise<FireblocksBulkVaultAccountJobDto> {
    return this.workflow.bulkCreateVaultAccountsForUsersWorkflow(command);
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
    return this.workflow.buildUserPortfolioWorkflow(customerRefId);
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
    return this.workflow.ensureVaultAddressesForAssetsWorkflow(
      vaultNamePrefix,
      assetIds,
      options,
    );
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
    return this.workflow.createSpecialAddressesWorkflow(request);
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
    return this.workflow.bulkEnsureVaultAssetsAndAddressesWorkflow(requests);
  }

  /**
   * Fetch existing vault wallets and their primary deposit addresses in bulk.
   */
  async bulkFetchVaultAssetsWithAddresses(
    requests: Array<{ vaultAccountId: string; assetId: string }>,
  ): Promise<FireblocksCustodialWalletDto[]> {
    return this.workflow.bulkFetchVaultAssetsWithAddressesWorkflow(requests);
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
}
