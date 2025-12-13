import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateMultipleAccountsRequest,
  CreateMultipleDepositAddressesRequest,
  CreateMultipleDepositAddressesJobStatus,
  CreateMultipleVaultAccountsJobStatus,
  JobCreated,
  PaginatedAssetWalletResponse,
  VaultAccount,
  VaultAccountsPagedResponse,
  VaultAsset,
  GetAPIUsersResponse,
  GetConsoleUsersResponse,
  GetUsersResponse,
} from '@fireblocks/ts-sdk';
import { AllConfigType } from '../../../../../../config/config.type';
import { FireblocksCwService } from '../../../fireblocks-cw.service';
import { FireblocksUserPortfolioDto } from '../../../dto/fireblocks-wallet.dto';
import { FireblocksCwMapper } from '../../../helpers/fireblocks-cw.mapper';
import { FireblocksSdkResponse } from '../../../types/fireblocks-base.type';
import { AbstractCwService } from '../../base/abstract-cw.service';

@Injectable()
export class AdminVaultService extends AbstractCwService {
  constructor(
    @Inject(forwardRef(() => FireblocksCwService))
    private readonly fireblocks: FireblocksCwService,
    configService: ConfigService<AllConfigType>,
  ) {
    super(AdminVaultService.name, configService);
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
  ): Promise<FireblocksSdkResponse<VaultAccountsPagedResponse>> {
    this.guardEnabledAndLog();
    return this.sdk.vaults.getPagedVaultAccounts({
      limit,
      before,
      after,
      assetId,
      namePrefix,
    });
  }

  /**
   * Fetch a vault account by id.
   */
  async fetchVaultAccountById(
    vaultAccountId: string,
  ): Promise<FireblocksSdkResponse<VaultAccount>> {
    this.guardEnabledAndLog();
    return this.sdk.vaults.getVaultAccount({ vaultAccountId });
  }

  /**
   * Fetch a specific asset wallet under a vault account.
   */
  async fetchVaultAccountAsset(
    vaultAccountId: string,
    assetId: string,
  ): Promise<FireblocksSdkResponse<VaultAsset>> {
    this.guardEnabledAndLog();
    return this.sdk.vaults.getVaultAccountAsset({
      vaultAccountId,
      assetId,
    });
  }

  /**
   * List asset wallets across vault accounts with optional asset filter.
   */
  async listAssetWalletsPaged(
    limit?: number,
    before?: string,
    after?: string,
    assetId?: string,
  ): Promise<FireblocksSdkResponse<PaginatedAssetWalletResponse>> {
    this.guardEnabledAndLog();
    return this.sdk.vaults.getAssetWallets({
      assetId,
      limit,
      before,
      after,
    });
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
    const accounts = (paged.data?.accounts || []).filter(
      (account) => (account as VaultAccount).customerRefId === customerRefId,
    );

    return FireblocksCwMapper.toUserPortfolioDto(
      customerRefId,
      accounts as VaultAccount[],
    );
  }

  /**
   * Start a bulk vault account creation job.
   */
  async bulkCreateVaultAccounts(
    request: CreateMultipleAccountsRequest,
    idempotencyKey?: string,
  ): Promise<FireblocksSdkResponse<JobCreated>> {
    this.guardEnabledAndLog();
    return this.sdk.vaults.createMultipleAccounts({
      createMultipleAccountsRequest: request,
      idempotencyKey,
    });
  }

  /**
   * Get status/results for a bulk vault account creation job.
   */
  async fetchBulkCreateVaultAccountsJobStatus(
    jobId: string,
  ): Promise<FireblocksSdkResponse<CreateMultipleVaultAccountsJobStatus>> {
    this.guardEnabledAndLog();
    return this.sdk.vaults.getCreateMultipleVaultAccountsJobStatus({ jobId });
  }

  /**
   * Start a bulk deposit address creation job.
   */
  async bulkCreateDepositAddresses(
    request: CreateMultipleDepositAddressesRequest,
    idempotencyKey?: string,
  ): Promise<FireblocksSdkResponse<JobCreated>> {
    this.guardEnabledAndLog();
    return this.sdk.vaults.createMultipleDepositAddresses({
      createMultipleDepositAddressesRequest: request,
      idempotencyKey,
    });
  }

  /**
   * Get status/results for a bulk deposit address creation job.
   */
  async fetchBulkCreateDepositAddressesJobStatus(
    jobId: string,
  ): Promise<FireblocksSdkResponse<CreateMultipleDepositAddressesJobStatus>> {
    this.guardEnabledAndLog();
    return this.sdk.vaults.getCreateMultipleDepositAddressesJobStatus({
      jobId,
    });
  }

  /**
   * List all workspace users (Admin API key required).
   */
  async listUsers(): Promise<FireblocksSdkResponse<GetUsersResponse>> {
    this.guardEnabledAndLog();
    return this.sdk.users.getUsers();
  }

  /**
   * List all API users (Admin API key required).
   */
  async listApiUsers(): Promise<FireblocksSdkResponse<GetAPIUsersResponse>> {
    this.guardEnabledAndLog();
    return this.sdk.apiUser.getApiUsers();
  }

  /**
   * List all console users (Admin API key required).
   */
  async listConsoleUsers(): Promise<
    FireblocksSdkResponse<GetConsoleUsersResponse>
  > {
    this.guardEnabledAndLog();
    return this.sdk.consoleUser.getConsoleUsers();
  }
}
