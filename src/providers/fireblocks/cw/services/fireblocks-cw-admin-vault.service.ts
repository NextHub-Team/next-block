import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateMultipleAccountsRequest,
  CreateMultipleDepositAddressesRequest,
  CreateMultipleDepositAddressesJobStatus,
  CreateMultipleVaultAccountsJobStatus,
  JobCreated,
  VaultAccount,
  VaultAsset,
  GetAPIUsersResponse,
  GetConsoleUsersResponse,
  GetUsersResponse,
} from '@fireblocks/ts-sdk';
import { AllConfigType } from '../../../../config/config.type';
import { FireblocksCwService } from '../fireblocks-cw.service';
import { FireblocksUserPortfolioDto } from '../dto/fireblocks-wallet.dto';
import {
  FireblocksAssetWalletsPageResponseDto,
  FireblocksResponseEnvelopeDto,
  FireblocksSpecialAddressItemDto,
  FireblocksSpecialAddressesResponseDto,
  FireblocksVaultAccountResponseDto,
  FireblocksVaultAccountsPageResponseDto,
  FireblocksVaultAssetResponseDto,
} from '../dto/fireblocks-response.dto';
import { FireblocksSpecialAddressesRequestDto } from '../dto/fireblocks-vault-requests.dto';
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
