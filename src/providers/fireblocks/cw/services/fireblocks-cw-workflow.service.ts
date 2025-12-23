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
import { v4 as uuidv4 } from 'uuid';
import { AllConfigType } from '../../../../config/config.type';
import { AccountsService } from '../../../../accounts/accounts.service';
import {
  AccountProviderName,
  AccountStatus,
  KycStatus,
} from '../../../../accounts/types/account-enum.type';
import { UsersService } from '../../../../users/users.service';
import { FireblocksCwService } from '../fireblocks-cw.service';
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
import { FireblocksCwMapper } from '../helpers/fireblocks-cw.mapper';
import { FireblocksVaultResponseMapper } from '../infrastructure/persistence/relational/mappers/fireblocks-vault-response.mapper';
import { AbstractCwService } from '../base/abstract-cw.service';
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
    private readonly accountsService: AccountsService,
    private readonly usersService: UsersService,
    configService: ConfigService<AllConfigType>,
  ) {
    super(FireblocksCwWorkflowService.name, configService);
  }

  private get sdk(): ReturnType<FireblocksCwService['getSdk']> {
    this.fireblocks.isReady();
    return this.fireblocks.getSdk();
  }

  async ensureVaultWalletWorkflow(
    vaultAccountId: string,
    assetId: string,
  ): Promise<FireblocksCustodialWalletDto> {
    this.guardEnabledAndLog();
    this.logger.debug(
      `Ensuring vault wallet (vault=${vaultAccountId}, asset=${assetId})`,
    );
    const idempotencyKey = this.ensureIdempotencyKey();

    const vaultAccountResponse = await this.sdk.vaults.getVaultAccount({
      vaultAccountId,
    });
    const vaultAccount = vaultAccountResponse.data as VaultAccount;

    const vaultAsset = await this.ensureVaultAsset(
      vaultAccountId,
      assetId,
      idempotencyKey,
    );

    const depositAddress = await this.getOrCreateDepositAddress({
      vaultAccountId,
      assetId,
      customerRefId: vaultAccount.customerRefId ?? vaultAccount.name,
      idempotencyKey,
      createIfMissing: true,
    });

    if (!depositAddress) {
      throw new BadRequestException(
        `Failed to ensure deposit address for vault ${vaultAccountId} (${assetId})`,
      );
    }

    return GroupPlainToInstance(
      FireblocksCustodialWalletDto,
      FireblocksCwMapper.toCustodialWalletDto({
        vaultAccount,
        vaultAsset,
        depositAddress,
      }),
      [RoleEnum.admin],
    );
  }

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

  async createVaultAccountWorkflow(
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

    const idempotencyKey = this.ensureIdempotencyKey();
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
      this.logFireblocksError('start bulk vault account creation', error);
      throw new ServiceUnavailableException(
        this.getFireblocksMessage(error) ??
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

  async buildUserPortfolioWorkflow(
    customerRefId: string,
  ): Promise<FireblocksUserPortfolioDto> {
    const response = await this.sdk.vaults.getPagedVaultAccounts({
      namePrefix: customerRefId,
    });
    const accounts = ((response.data?.accounts as VaultAccount[]) || []).filter(
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
      this.logFireblocksError(`check vault existence (name=${name})`, error);
      throw new ServiceUnavailableException(
        'Unable to verify existing vault accounts in Fireblocks',
      );
    }
  }

  private logFireblocksError(action: string, error: unknown): void {
    const message = error instanceof Error ? error.message : `${error}`;
    const errObj = error as any;
    const details =
      errObj?.response?.data ?? errObj?.data ?? errObj?.response ?? undefined;

    let detailsString = '';
    try {
      if (details !== undefined) {
        detailsString =
          typeof details === 'string'
            ? details
            : JSON.stringify(details, null, 2);
      }
    } catch {
      detailsString = `${details ?? ''}`;
    }

    this.logger.error(
      `[Fireblocks] ${action} failed: ${message}${
        errObj?.response?.status ? ` (status=${errObj.response.status})` : ''
      }`,
      detailsString,
    );
  }

  private getFireblocksMessage(error: unknown): string | undefined {
    const errObj = error as any;
    const candidate =
      errObj?.response?.data?.errorMessage ??
      errObj?.response?.data?.message ??
      errObj?.data?.errorMessage ??
      errObj?.data?.message ??
      errObj?.message;

    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate;
    }
    return undefined;
  }

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

  private ensureIdempotencyKey(key?: string): string {
    if (key && key.trim().length > 0) {
      return key.trim();
    }
    return uuidv4();
  }
}
