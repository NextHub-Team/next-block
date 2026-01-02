import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateAddressResponse,
  JobCreated,
  VaultAccount,
  VaultAsset,
} from '@fireblocks/ts-sdk';
import { AllConfigType } from '../../../../config/config.type';
import { UsersService } from '../../../../users/users.service';
import { FireblocksCwService } from '../fireblocks-cw.service';
import { FireblocksCwSyncService } from './fireblocks-cw-sync.service';
import {
  FireblocksSpecialAddressItemDto,
  FireblocksSpecialAddressesResponseDto,
  FireblocksBulkVaultAccountsSyncDto,
  FireblocksCustodialWalletDto,
  FireblocksDepositAddressDto,
  FireblocksUserPortfolioDto,
  FireblocksVaultAccountDto,
  FireblocksBulkVaultAccountJobDto,
} from '../dto/fireblocks-cw-responses.dto';
import {
  BulkCreateVaultAccountsRequestDto,
  CreateAdminVaultAccountRequestDto,
  SpecialAddressesRequestDto,
  VaultAccountsByIdsQueryDto,
} from '../dto/fireblocks-cw-requests.dto';
import { FireblocksCwMapper } from '../infrastructure/persistence/relational/mappers/fireblocks-cw.mapper';
import { FireblocksVaultResponseMapper } from '../infrastructure/persistence/relational/mappers/fireblocks-vault-response.mapper';
import { FireblocksErrorMapper } from '../infrastructure/persistence/relational/mappers/fireblocks-error.mapper';
import { AbstractCwService } from '../base/abstract-cw.service';
import {
  ensureIdempotencyKey,
  getFireblocksMessage,
  logFireblocksError,
} from '../helpers/fireblocks-cw-service.helper';
import {
  GroupPlainToInstance,
  GroupPlainToInstances,
} from '../../../../utils/transformers/class.transformer';
import { RoleEnum } from '../../../../roles/roles.enum';
import { BULK_VAULT_CREATE_LIMIT } from '../types/fireblocks-const.type';

/**
 * Houses multi-step admin workflows that orchestrate Fireblocks calls and local persistence.
 */
@Injectable()
export class FireblocksCwWorkflowService extends AbstractCwService {
  constructor(
    @Inject(forwardRef(() => FireblocksCwService))
    private readonly fireblocks: FireblocksCwService,
    private readonly persistence: FireblocksCwSyncService,
    private readonly usersService: UsersService,
    private readonly errorMapper: FireblocksErrorMapper,
    configService: ConfigService<AllConfigType>,
  ) {
    super(FireblocksCwWorkflowService.name, configService);
  }

  private get sdk(): ReturnType<FireblocksCwService['getSdk']> {
    this.fireblocks.isReady();
    return this.fireblocks.getSdk();
  }

  /**
   * Ensure a vault account has the requested asset wallet and a deposit address.
   * Returns a flag indicating whether creation occurred.
   */
  async ensureVaultWalletWorkflow(
    vaultAccountId: string,
    assetId: string,
  ): Promise<{ wallet: FireblocksCustodialWalletDto; created: boolean }> {
    this.guardEnabledAndLog();
    this.logger.debug(
      `Ensuring vault wallet (vault=${vaultAccountId}, asset=${assetId})`,
    );
    const idempotencyKey = ensureIdempotencyKey();

    let vaultAccount: VaultAccount;
    try {
      const vaultAccountResponse = await this.sdk.vaults.getVaultAccount({
        vaultAccountId,
      });
      vaultAccount = vaultAccountResponse.data as VaultAccount;
    } catch (error: unknown) {
      throw this.errorMapper.toHttpException(
        error,
        `Failed to fetch vault account ${vaultAccountId} from Fireblocks`,
      );
    }

    const vaultAssetResult = await this.ensureVaultAsset(
      vaultAccountId,
      assetId,
      idempotencyKey,
    );
    const vaultAsset = vaultAssetResult.asset;

    const depositAddressResult = await this.getOrCreateDepositAddress({
      vaultAccountId,
      assetId,
      customerRefId: vaultAccount.customerRefId ?? vaultAccount.name,
      idempotencyKey,
      createIfMissing: true,
    });
    const depositAddress = depositAddressResult.address;

    if (!depositAddress) {
      throw new BadRequestException(
        `Failed to ensure deposit address for vault ${vaultAccountId} (${assetId})`,
      );
    }

    const wallet = GroupPlainToInstance(
      FireblocksCustodialWalletDto,
      FireblocksCwMapper.toCustodialWalletDto({
        vaultAccount,
        vaultAsset,
        depositAddress,
      }),
      [RoleEnum.admin],
    );

    await this.persistence.syncWallet({
      wallet,
      userId: vaultAccount.customerRefId,
      socialId: vaultAccount.customerRefId,
    });
    this.logger.log(
      `Ensured vault wallet locally vault=${vaultAccountId} asset=${assetId}`,
    );

    return {
      wallet,
      created: vaultAssetResult.created || depositAddressResult.created,
    };
  }

  /**
   * Fetch multiple Fireblocks vault accounts by id and sync any found locally.
   * Missing ids are collected and returned.
   */
  async fetchVaultAccountsByIdsWorkflow(
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

        await this.persistence.syncAccount({
          vaultAccount: vaultAccountDto,
          customerRefId: vaultAccountDto.customerRefId,
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
   * Create or return an existing vault account for the given socialId; sync to DB.
   */
  async createVaultAccountWorkflow(
    command: CreateAdminVaultAccountRequestDto,
  ): Promise<{ account: FireblocksVaultAccountDto; created: boolean }> {
    this.guardEnabledAndLog();
    const socialId = command.socialId;
    const name = this.fireblocks.buildVaultNameFromIdentifier(socialId);
    const customerRefId = socialId;
    this.logger.debug(
      `Creating vault account (name=${name}, customerRefId=${customerRefId})`,
    );
    const idempotencyKey = ensureIdempotencyKey(command.idempotencyKey);

    // If the vault already exists for this socialId/name, return it instead of creating a duplicate.
    const existingResp = await this.sdk.vaults.getPagedVaultAccounts({
      namePrefix: name,
      limit: 1,
    });
    const existingAccount = existingResp.data?.accounts?.find(
      (account) =>
        account.name === name ||
        (account as VaultAccount).customerRefId === customerRefId,
    ) as VaultAccount | undefined;

    if (existingAccount) {
      const existingDto = FireblocksCwMapper.toVaultAccountDto(
        existingAccount,
        existingAccount.assets as VaultAsset[] | undefined,
      );
      await this.persistence.syncAccount({
        vaultAccount: existingDto,
        customerRefId,
        userId: customerRefId,
        socialId,
      });
      this.logger.debug(
        `Vault account already exists; returning existing (id=${existingAccount.id})`,
      );
      return { account: existingDto, created: false };
    }

    const response = await this.sdk.vaults.createVaultAccount({
      createVaultAccountRequest: {
        name,
        customerRefId,
        hiddenOnUI: command.hiddenOnUI ?? true,
        autoFuel: command.autoFuel ?? false,
      },
      idempotencyKey,
    });

    const vaultAccountDto =
      FireblocksVaultResponseMapper.vaultAccount(response);

    await this.persistence.syncAccount({
      vaultAccount: vaultAccountDto,
      customerRefId,
      userId: customerRefId,
      socialId,
    });

    this.logger.debug(
      `Vault account created and synced (id=${vaultAccountDto.id})`,
    );

    return { account: vaultAccountDto, created: true };
  }

  /**
   * Kick off a Fireblocks bulk vault account creation job for multiple users.
   */
  async bulkCreateVaultAccountsForUsersWorkflow(
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

    const namesToCreate: string[] = [];
    const existingVaultNames: string[] = [];
    const existenceChecks = await Promise.all(
      names.map(async (name) => ({
        name,
        exists: await this.vaultExistsByName(name),
      })),
    );
    for (const check of existenceChecks) {
      if (check.exists) {
        existingVaultNames.push(check.name);
      } else {
        namesToCreate.push(check.name);
      }
    }

    if (!namesToCreate.length) {
      throw new ConflictException(
        'Vault accounts already exist for all provided users',
      );
    }

    const idempotencyKey = ensureIdempotencyKey();
    let job: JobCreated;
    try {
      const response = await this.sdk.vaults.createMultipleAccounts({
        createMultipleAccountsRequest: {
          count: namesToCreate.length,
          baseAssetIds: command.baseAssetIds ?? [],
          names: namesToCreate,
        },
        idempotencyKey,
      });
      job = response.data as JobCreated;
    } catch (error: unknown) {
      logFireblocksError(
        this.logger,
        'start bulk vault account creation',
        error,
      );
      throw new ServiceUnavailableException(
        getFireblocksMessage(error) ??
          'Failed to start bulk vault account creation in Fireblocks',
      );
    }

    if (!job?.jobId) {
      throw new ServiceUnavailableException(
        'Fireblocks did not return a job id for bulk vault creation',
      );
    }

    return GroupPlainToInstance(
      FireblocksBulkVaultAccountJobDto,
      {
        jobId: job.jobId,
        requested: namesToCreate.length,
        names: namesToCreate,
        baseAssetIds: command.baseAssetIds ?? [],
        existingVaultNames:
          existingVaultNames.length > 0 ? existingVaultNames : undefined,
      },
      [RoleEnum.admin],
    );
  }

  /**
   * Build a portfolio of vault accounts for a user (by socialId/customerRefId).
   */
  async buildUserPortfolioWorkflow(
    socialId: string,
  ): Promise<FireblocksUserPortfolioDto> {
    // Prefer fetching by the expected vault name; fall back to customerRefId match
    const vaultName = this.fireblocks.buildVaultNameFromIdentifier(socialId);

    // 1) Try by vault name prefix (exact match)
    const byName = await this.sdk.vaults.getPagedVaultAccounts({
      namePrefix: vaultName,
      limit: 1,
    });
    let accounts = ((byName.data?.accounts as VaultAccount[]) || []).filter(
      (account) => account.name === vaultName,
    );

    // 2) Fallback: query by socialId/customerRefId prefix if not found by name
    if (accounts.length === 0) {
      const byCustomerRef = await this.sdk.vaults.getPagedVaultAccounts({
        namePrefix: socialId,
      });
      accounts = (
        (byCustomerRef.data?.accounts as VaultAccount[]) || []
      ).filter((account) => account.customerRefId === socialId);
    }

    const dto = FireblocksCwMapper.toUserPortfolioDto(
      socialId,
      accounts as VaultAccount[],
    );

    return GroupPlainToInstance(FireblocksUserPortfolioDto, dto, [
      RoleEnum.admin,
    ]);
  }

  /**
   * Ensure a vault (by name prefix) has deposit addresses for the provided assets.
   */
  async ensureVaultAddressesForAssetsWorkflow(
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
      const { asset: vaultAsset } = await this.ensureVaultAsset(
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

      const depositAddressDto = FireblocksCwMapper.toDepositAddressDto(
        depositAddress.data,
      );

      const wallet = FireblocksCwMapper.toCustodialWalletDto({
        vaultAccount,
        vaultAsset,
        depositAddress: depositAddress.data as CreateAddressResponse,
      });

      await this.persistence.syncWallet({
        wallet,
        userId: vaultAccount.customerRefId,
        socialId: vaultAccount.customerRefId,
      });

      addresses[assetId] = depositAddressDto;
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
   * Create special deposit addresses for a set of assets on a vault account.
   */
  async createSpecialAddressesWorkflow(
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

    try {
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
        const { asset: vaultAsset } = await this.ensureVaultAsset(
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

        const wallet = FireblocksCwMapper.toCustodialWalletDto({
          vaultAccount,
          vaultAsset,
          depositAddress: depositAddress.data as CreateAddressResponse,
        });

        await this.persistence.syncWallet({
          wallet,
          userId: vaultAccount.customerRefId,
          socialId: vaultAccount.customerRefId,
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
    } catch (error) {
      this.logger.error(
        `Failed to create special addresses (vault=${vaultAccountId}): ${error instanceof Error ? error.message : error}`,
      );
      throw this.errorMapper.toHttpException(
        error,
        'Fireblocks rejected address creation request',
      );
    }
  }

  /**
   * Ensure multiple vault/asset pairs each have an asset wallet and deposit address.
   */
  async bulkEnsureVaultAssetsAndAddressesWorkflow(
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
      let vaultAccount: VaultAccount | undefined = cachedVault;
      if (!vaultAccount) {
        try {
          const response = await this.sdk.vaults.getVaultAccount({
            vaultAccountId: request.vaultAccountId,
          });
          vaultAccount = response.data as VaultAccount;
        } catch (error: unknown) {
          throw this.errorMapper.toHttpException(
            error,
            `Failed to fetch vault account ${request.vaultAccountId} from Fireblocks`,
          );
        }
      }

      if (!vaultAccount) {
        throw new NotFoundException(
          `Vault account ${request.vaultAccountId} could not be resolved`,
        );
      }

      vaultCache.set(request.vaultAccountId, vaultAccount);
      const idempotencyKey = ensureIdempotencyKey(request.idempotencyKey);

      const { asset: vaultAsset } = await this.ensureVaultAsset(
        request.vaultAccountId,
        request.assetId,
        idempotencyKey,
      );

      const { address: depositAddress } = await this.getOrCreateDepositAddress({
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

      const wallet = FireblocksCwMapper.toCustodialWalletDto({
        vaultAccount,
        vaultAsset,
        depositAddress,
      });

      await this.persistence.syncWallet({
        wallet,
        userId: vaultAccount.customerRefId ?? request.customerRefId,
        socialId: vaultAccount.customerRefId,
      });

      results.push(wallet);
    }

    return GroupPlainToInstances(FireblocksCustodialWalletDto, results, [
      RoleEnum.admin,
    ]);
  }

  /**
   * Fetch wallets and deposit addresses for multiple vault/asset pairs (no creation).
   */
  async bulkFetchVaultAssetsWithAddressesWorkflow(
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
      let vaultAccount: VaultAccount | undefined = cachedVault;
      if (!vaultAccount) {
        try {
          const resp = await this.sdk.vaults.getVaultAccount({
            vaultAccountId: request.vaultAccountId,
          });
          vaultAccount = resp.data as VaultAccount;
        } catch (error: unknown) {
          throw this.errorMapper.toHttpException(
            error,
            `Failed to fetch vault account ${request.vaultAccountId} from Fireblocks`,
          );
        }
      }

      if (!vaultAccount) {
        throw new NotFoundException(
          `Vault account ${request.vaultAccountId} could not be resolved`,
        );
      }

      vaultCache.set(request.vaultAccountId, vaultAccount);

      let vaultAsset: VaultAsset;
      try {
        const vaultAssetResponse = await this.sdk.vaults.getVaultAccountAsset({
          vaultAccountId: request.vaultAccountId,
          assetId: request.assetId,
        });
        vaultAsset = vaultAssetResponse.data as VaultAsset;
      } catch (error: unknown) {
        throw this.errorMapper.toHttpException(
          error,
          `Failed to fetch asset ${request.assetId} for vault ${request.vaultAccountId}`,
        );
      }

      const { address: depositAddress } = await this.getOrCreateDepositAddress({
        vaultAccountId: request.vaultAccountId,
        assetId: request.assetId,
      });

      if (!depositAddress) {
        throw new NotFoundException(
          `No deposit address found for vault ${request.vaultAccountId} and asset ${request.assetId}`,
        );
      }

      const wallet = FireblocksCwMapper.toCustodialWalletDto({
        vaultAccount,
        vaultAsset,
        depositAddress,
      });

      await this.persistence.syncWallet({
        wallet,
        userId: vaultAccount.customerRefId,
        socialId: vaultAccount.customerRefId,
      });

      results.push(wallet);
    }

    return GroupPlainToInstances(FireblocksCustodialWalletDto, results, [
      RoleEnum.admin,
    ]);
  }

  private async vaultExistsByName(name: string): Promise<boolean> {
    try {
      const paged = await this.sdk.vaults.getPagedVaultAccounts({
        namePrefix: name,
        limit: 1,
      });
      return !!paged.data?.accounts?.find(
        (account) => (account as VaultAccount)?.name === name,
      );
    } catch (error: unknown) {
      logFireblocksError(
        this.logger,
        `check vault existence (name=${name})`,
        error,
      );
      throw new ServiceUnavailableException(
        'Unable to verify existing vault accounts in Fireblocks',
      );
    }
  }

  private async getOrCreateDepositAddress(params: {
    vaultAccountId: string;
    assetId: string;
    customerRefId?: string;
    description?: string;
    idempotencyKey?: string;
    createIfMissing?: boolean;
  }): Promise<{ address?: CreateAddressResponse; created: boolean }> {
    try {
      const response =
        await this.sdk.vaults.getVaultAccountAssetAddressesPaginated({
          vaultAccountId: params.vaultAccountId,
          assetId: params.assetId,
          limit: 1,
        });

      const existing = response.data?.addresses?.[0];
      if (existing?.address) {
        return { address: existing as CreateAddressResponse, created: false };
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
      return { address: undefined, created: false };
    }

    try {
      const created = await this.sdk.vaults.createVaultAccountAssetAddress({
        vaultAccountId: params.vaultAccountId,
        assetId: params.assetId,
        createAddressRequest: {
          customerRefId: params.customerRefId,
          description: params.description,
        },
        idempotencyKey: params.idempotencyKey,
      });

      return { address: created.data as CreateAddressResponse, created: true };
    } catch (error: unknown) {
      throw this.errorMapper.toHttpException(
        error,
        `Failed to create deposit address for vault ${params.vaultAccountId} (${params.assetId})`,
      );
    }
  }

  private async ensureVaultAsset(
    vaultAccountId: string,
    assetId: string,
    idempotencyKey?: string,
  ): Promise<{ asset: VaultAsset; created: boolean }> {
    const normalize = (asset: VaultAsset | undefined): VaultAsset => {
      return {
        ...(asset ?? {}),
        id: (asset as { id?: string })?.id ?? assetId,
        assetId: (asset as { assetId?: string })?.assetId ?? assetId,
      } as VaultAsset;
    };

    try {
      const response = await this.sdk.vaults.getVaultAccountAsset({
        vaultAccountId,
        assetId,
      });
      if (response?.data) {
        return {
          asset: normalize(response.data as VaultAsset),
          created: false,
        };
      }
    } catch (error: unknown) {
      this.logger.warn(
        `Vault asset ${assetId} not found for account ${vaultAccountId}; creating wallet...`,
      );
      if (error instanceof Error) {
        this.logger.debug(error.message);
      }
    }

    try {
      const created = await this.sdk.vaults.createVaultAccountAsset({
        vaultAccountId,
        assetId,
        idempotencyKey,
      });

      return { asset: normalize(created.data as VaultAsset), created: true };
    } catch (error: unknown) {
      this.logger.error(
        `Failed to create asset ${assetId} for vault ${vaultAccountId}`,
        error instanceof Error ? error.message : `${error}`,
      );
      throw this.errorMapper.toHttpException(
        error,
        `Failed to create asset ${assetId} for vault ${vaultAccountId}`,
      );
    }
  }
}
