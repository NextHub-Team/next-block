import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/domain/account';
import { FireblocksCwWalletAsset } from './types/fireblocks-cw-wallet.type';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateFireblocksCwWalletDto } from './dto/create-fireblocks-cw-wallet.dto';
import { UpdateFireblocksCwWalletDto } from './dto/update-fireblocks-cw-wallet.dto';
import { FireblocksCwWalletRepository } from './infrastructure/persistence/fireblocks-cw-wallet.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { FireblocksCwWallet } from './domain/fireblocks-cw-wallet';
import { FIREBLOCKS_CW_WALLET_BULK_LIMIT_DEFAULT } from './types/fireblocks-cw-wallets.const';
import { TypeMessage } from '../utils/types/message.type';

@Injectable()
export class FireblocksCwWalletsService {
  constructor(
    private readonly accountService: AccountsService,

    // Dependencies here
    private readonly fireblocksCwWalletRepository: FireblocksCwWalletRepository,
  ) {}

  async create(createFireblocksCwWalletDto: CreateFireblocksCwWalletDto) {
    // Do not remove comment below.
    // <creating-property />
    const account = await this.accountService.findByIdOrFail(
      createFireblocksCwWalletDto.account.id,
    );

    return this.fireblocksCwWalletRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      account,

      assets: createFireblocksCwWalletDto.assets,

      vaultType: createFireblocksCwWalletDto.vaultType,

      autoFuel: createFireblocksCwWalletDto.autoFuel,

      hiddenOnUI: createFireblocksCwWalletDto.hiddenOnUI,

      name: createFireblocksCwWalletDto.name,

      customerRefId: createFireblocksCwWalletDto.customerRefId,
    });
  }

  async createBulk(
    createFireblocksCwWalletsDto: CreateFireblocksCwWalletDto[],
    limit = FIREBLOCKS_CW_WALLET_BULK_LIMIT_DEFAULT,
  ): Promise<FireblocksCwWallet[]> {
    if (!createFireblocksCwWalletsDto?.length) {
      return [];
    }

    const max = limit ?? FIREBLOCKS_CW_WALLET_BULK_LIMIT_DEFAULT;
    if (createFireblocksCwWalletsDto.length > max) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: TypeMessage.getMessageByStatus(
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        errors: { wallets: 'BulkLimitExceeded' },
      });
    }

    return Promise.all(
      createFireblocksCwWalletsDto.map((walletDto) => this.create(walletDto)),
    );
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.fireblocksCwWalletRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: FireblocksCwWallet['id']) {
    return this.fireblocksCwWalletRepository.findById(id);
  }

  findByIds(ids: FireblocksCwWallet['id'][]) {
    return this.fireblocksCwWalletRepository.findByIds(ids);
  }

  async findByAccountId(accountId: Account['id']) {
    return this.fireblocksCwWalletRepository.findByAccountId(accountId);
  }

  async upsertByAccountId(payload: {
    accountId: Account['id'];
    assets?: FireblocksCwWalletAsset[] | null;
    vaultType?: FireblocksCwWallet['vaultType'];
    autoFuel?: FireblocksCwWallet['autoFuel'];
    hiddenOnUI?: FireblocksCwWallet['hiddenOnUI'];
    name?: FireblocksCwWallet['name'];
    customerRefId?: FireblocksCwWallet['customerRefId'];
  }): Promise<FireblocksCwWallet> {
    const account = await this.accountService.findByIdOrFail(payload.accountId);
    const existing = await this.fireblocksCwWalletRepository.findByAccountId(
      account.id,
    );

    const mergedAssets = this.mergeAssets(existing?.assets, payload.assets);
    const base: Omit<FireblocksCwWallet, 'id' | 'createdAt' | 'updatedAt'> = {
      account,
      assets: mergedAssets,
      vaultType: payload.vaultType ?? existing?.vaultType ?? 'SYSTEM',
      autoFuel: payload.autoFuel ?? existing?.autoFuel ?? false,
      hiddenOnUI: payload.hiddenOnUI ?? existing?.hiddenOnUI ?? true,
      name: payload.name ?? existing?.name ?? 'Fireblocks Vault',
      customerRefId:
        payload.customerRefId ??
        existing?.customerRefId ??
        `${account.id}`.toString(),
    };

    if (existing) {
      const updated = await this.fireblocksCwWalletRepository.update(
        existing.id,
        base,
      );
      if (updated) {
        return updated;
      }
    }

    return this.fireblocksCwWalletRepository.create(base);
  }

  async update(
    id: FireblocksCwWallet['id'],

    updateFireblocksCwWalletDto: UpdateFireblocksCwWalletDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let account: Account | undefined = undefined;

    if (updateFireblocksCwWalletDto.account) {
      account = await this.accountService.findByIdOrFail(
        updateFireblocksCwWalletDto.account.id,
      );
    }

    return this.fireblocksCwWalletRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      account,

      assets: updateFireblocksCwWalletDto.assets,

      vaultType: updateFireblocksCwWalletDto.vaultType,

      autoFuel: updateFireblocksCwWalletDto.autoFuel,

      hiddenOnUI: updateFireblocksCwWalletDto.hiddenOnUI,

      name: updateFireblocksCwWalletDto.name,

      customerRefId: updateFireblocksCwWalletDto.customerRefId,
    });
  }

  async updateBulk(
    updates: Array<{
      id: FireblocksCwWallet['id'];
      payload: UpdateFireblocksCwWalletDto;
    }>,
    limit = FIREBLOCKS_CW_WALLET_BULK_LIMIT_DEFAULT,
  ): Promise<FireblocksCwWallet[]> {
    if (!updates?.length) {
      return [];
    }

    const max = limit ?? FIREBLOCKS_CW_WALLET_BULK_LIMIT_DEFAULT;
    if (updates.length > max) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: TypeMessage.getMessageByStatus(
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        errors: { wallets: 'BulkLimitExceeded' },
      });
    }

    const updatedWallets: FireblocksCwWallet[] = [];
    for (const update of updates) {
      const updated = await this.update(update.id, update.payload);
      if (updated) {
        updatedWallets.push(updated);
      }
    }

    return updatedWallets;
  }

  remove(id: FireblocksCwWallet['id']) {
    return this.fireblocksCwWalletRepository.remove(id);
  }

  private mergeAssets(
    existing?: FireblocksCwWalletAsset[] | null,
    incoming?: FireblocksCwWalletAsset[] | null,
  ): FireblocksCwWalletAsset[] | null | undefined {
    if (!incoming || incoming.length === 0) {
      return existing ?? incoming;
    }

    const merged = new Map<string, FireblocksCwWalletAsset>();
    for (const asset of existing ?? []) {
      if (asset?.id) {
        merged.set(asset.id, asset);
      }
    }

    for (const asset of incoming) {
      if (!asset?.id) {
        continue;
      }
      const current = merged.get(asset.id);
      merged.set(asset.id, { ...current, ...asset });
    }

    return Array.from(merged.values());
  }
}
