import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateMultipleAccountsRequest,
  CreateMultipleDepositAddressesRequest,
  CreateMultipleDepositAddressesJobStatus,
  CreateMultipleVaultAccountsJobStatus,
  CreateVaultAssetResponse,
  JobCreated,
  VaultAccount,
  VaultAsset,
  GetAPIUsersResponse,
  GetConsoleUsersResponse,
  GetUsersResponse,
  UpdateVaultAccountRequest,
  UpdateVaultAccountAssetAddressRequest,
  VaultActionStatus,
} from '@fireblocks/ts-sdk';
import { AllConfigType } from '../../../../config/config.type';
import { FireblocksCwService } from '../fireblocks-cw.service';
import {
  FireblocksDepositAddressDto,
  FireblocksUserPortfolioDto,
  FireblocksVaultAccountDto,
  FireblocksVaultAssetDto,
} from '../dto/fireblocks-wallet.dto';
import {
  FireblocksAssetWalletsPageResponseDto,
  FireblocksResponseEnvelopeDto,
  FireblocksSpecialAddressItemDto,
  FireblocksSpecialAddressesResponseDto,
  FireblocksVaultAccountResponseDto,
  FireblocksVaultAccountsPageResponseDto,
  FireblocksVaultAssetResponseDto,
} from '../dto/fireblocks-response.dto';
import {
  FireblocksSpecialAddressesRequestDto,
  UpdateCustodialWalletDto,
} from '../dto/fireblocks-vault-requests.dto';
import { FireblocksCwMapper } from '../helpers/fireblocks-cw.mapper';
import { AbstractCwService } from '../base/abstract-cw.service';
import { FireblocksVaultResponseMapper } from '../infrastructure/persistence/relational/mappers/fireblocks-vault-response.mapper';

@Injectable()
export class FireblocksCwAdminVaultService extends AbstractCwService {
  constructor(
    @Inject(forwardRef(() => FireblocksCwService))
    private readonly fireblocks: FireblocksCwService,
    configService: ConfigService<AllConfigType>,
  ) {
    super(FireblocksCwAdminVaultService.name, configService);
  }

  private get sdk(): ReturnType<FireblocksCwService['getSdk']> {
    this.fireblocks.isReady();
    return this.fireblocks.getSdk();
  }

  /**
   * List vault accounts with pagination and optional filters (assetId, namePrefix/socialId).
   */
  async listVaultAccountsPaged(
    limit?: number,
    before?: string,
    after?: string,
    assetId?: string,
    namePrefix?: string,
  ): Promise<FireblocksVaultAccountsPageResponseDto> {
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
  ): Promise<FireblocksVaultAccountResponseDto> {
    this.guardEnabledAndLog();
    const response = await this.sdk.vaults.getVaultAccount({ vaultAccountId });
    return FireblocksVaultResponseMapper.vaultAccount(response);
  }

  /**
   * Fetch a specific asset wallet under a vault account.
   */
  async fetchVaultAccountAsset(
    vaultAccountId: string,
    assetId: string,
  ): Promise<FireblocksVaultAssetResponseDto> {
    this.guardEnabledAndLog();
    const response = await this.sdk.vaults.getVaultAccountAsset({
      vaultAccountId,
      assetId,
    });

    return FireblocksVaultResponseMapper.vaultAsset(response);
  }

  /**
   * List asset wallets across vault accounts with optional asset filter.
   */
  async listAssetWalletsPaged(
    limit?: number,
    before?: string,
    after?: string,
    assetId?: string,
  ): Promise<FireblocksAssetWalletsPageResponseDto> {
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
   * Build a portfolio of vault accounts for a user by customer ref id.
   */
  async fetchUserPortfolioByCustomerRefId(
    customerRefId: string,
  ): Promise<FireblocksResponseEnvelopeDto<FireblocksUserPortfolioDto>> {
    const paged = await this.listVaultAccountsPaged(
      undefined,
      undefined,
      undefined,
      undefined,
      customerRefId,
    );
    const accounts = (paged.data.accounts || []).filter(
      (account) => account.customerRefId === customerRefId,
    );

    const dto = FireblocksCwMapper.toUserPortfolioDto(
      customerRefId,
      accounts as VaultAccount[],
    );

    return {
      statusCode: paged.statusCode,
      headers: paged.headers,
      data: dto,
    };
  }

  /**
   * Start a bulk vault account creation job.
   */
  async bulkCreateVaultAccounts(
    request: CreateMultipleAccountsRequest,
    idempotencyKey?: string,
  ): Promise<FireblocksResponseEnvelopeDto<JobCreated>> {
    this.guardEnabledAndLog();
    const response = await this.sdk.vaults.createMultipleAccounts({
      createMultipleAccountsRequest: request,
      idempotencyKey,
    });

    return FireblocksVaultResponseMapper.envelope(response);
  }

  /**
   * Get status/results for a bulk vault account creation job.
   */
  async fetchBulkCreateVaultAccountsJobStatus(
    jobId: string,
  ): Promise<
    FireblocksResponseEnvelopeDto<CreateMultipleVaultAccountsJobStatus>
  > {
    this.guardEnabledAndLog();
    const response =
      await this.sdk.vaults.getCreateMultipleVaultAccountsJobStatus({ jobId });
    return FireblocksVaultResponseMapper.envelope(response);
  }

  /**
   * Start a bulk deposit address creation job.
   */
  async bulkCreateDepositAddresses(
    request: CreateMultipleDepositAddressesRequest,
    idempotencyKey?: string,
  ): Promise<FireblocksResponseEnvelopeDto<JobCreated>> {
    this.guardEnabledAndLog();
    const response = await this.sdk.vaults.createMultipleDepositAddresses({
      createMultipleDepositAddressesRequest: request,
      idempotencyKey,
    });

    return FireblocksVaultResponseMapper.envelope(response);
  }

  /**
   * Get status/results for a bulk deposit address creation job.
   */
  async fetchBulkCreateDepositAddressesJobStatus(
    jobId: string,
  ): Promise<
    FireblocksResponseEnvelopeDto<CreateMultipleDepositAddressesJobStatus>
  > {
    this.guardEnabledAndLog();
    const response =
      await this.sdk.vaults.getCreateMultipleDepositAddressesJobStatus({
        jobId,
      });

    return FireblocksVaultResponseMapper.envelope(response);
  }

  /**
   * Create special deposit addresses for a set of assets in a vault account.
   */
  async createSpecialAddressesForAssets(
    request: FireblocksSpecialAddressesRequestDto,
  ): Promise<
    FireblocksResponseEnvelopeDto<FireblocksSpecialAddressesResponseDto>
  > {
    this.guardEnabledAndLog();

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

    return {
      statusCode: vaultAccountResponse.statusCode,
      headers: vaultAccountResponse.headers,
      data: {
        vaultAccount: vaultAccountDto,
        addresses: createdAddresses,
      },
    };
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
   * List all workspace users (Admin API key required).
   */
  async listUsers(): Promise<FireblocksResponseEnvelopeDto<GetUsersResponse>> {
    this.guardEnabledAndLog();
    const response = await this.sdk.users.getUsers();
    return FireblocksVaultResponseMapper.envelope(response);
  }

  /**
   * List all API users (Admin API key required).
   */
  async listApiUsers(): Promise<
    FireblocksResponseEnvelopeDto<GetAPIUsersResponse>
  > {
    this.guardEnabledAndLog();
    const response = await this.sdk.apiUser.getApiUsers();
    return FireblocksVaultResponseMapper.envelope(response);
  }

  /**
   * List all console users (Admin API key required).
   */
  async listConsoleUsers(): Promise<
    FireblocksResponseEnvelopeDto<GetConsoleUsersResponse>
  > {
    this.guardEnabledAndLog();
    const response = await this.sdk.consoleUser.getConsoleUsers();
    return FireblocksVaultResponseMapper.envelope(response);
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
}
