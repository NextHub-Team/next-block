import { SleevesTransactionsService } from '../sleeves-transactions/sleeves-transactions.service';
import { SleevesTransaction } from '../sleeves-transactions/domain/sleeves-transaction';

import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/domain/account';
import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  Inject,
  forwardRef,
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
    @Inject(forwardRef(() => SleevesTransactionsService))
    private readonly sleevesTransactionService: SleevesTransactionsService,

    private readonly accountService: AccountsService,

    // Dependencies here
    private readonly fireblocksCwWalletRepository: FireblocksCwWalletRepository,
  ) {}

  async create(createFireblocksCwWalletDto: CreateFireblocksCwWalletDto) {
    // Do not remove comment below.
    // <creating-property />
    let SleevesTransactions: SleevesTransaction[] | null | undefined =
      undefined;

    if (createFireblocksCwWalletDto.SleevesTransactions) {
      const SleevesTransactionsObjects =
        await this.sleevesTransactionService.findByIds(
          createFireblocksCwWalletDto.SleevesTransactions.map(
            (entity) => entity.id,
          ),
        );
      if (
        SleevesTransactionsObjects.length !==
        createFireblocksCwWalletDto.SleevesTransactions.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            SleevesTransactions: 'notExists',
          },
        });
      }
      SleevesTransactions = SleevesTransactionsObjects;
    } else if (createFireblocksCwWalletDto.SleevesTransactions === null) {
      SleevesTransactions = null;
    }

    const account = await this.accountService.findByIdOrFail(
      createFireblocksCwWalletDto.account.id,
    );

    return this.fireblocksCwWalletRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      SleevesTransactions,

      account,

      assetId: createFireblocksCwWalletDto.assetId,

      address: createFireblocksCwWalletDto.address,
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
    assetId: FireblocksCwWallet['assetId'];
    address: FireblocksCwWallet['address'];
  }): Promise<FireblocksCwWallet> {
    const account = await this.accountService.findByIdOrFail(payload.accountId);
    const existing =
      await this.fireblocksCwWalletRepository.findByAccountIdAndAssetId({
        accountId: account.id,
        assetId: payload.assetId,
      });

    const base: Omit<FireblocksCwWallet, 'id' | 'createdAt' | 'updatedAt'> = {
      account,
      assetId: payload.assetId,
      address: payload.address,
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
    let SleevesTransactions: SleevesTransaction[] | null | undefined =
      undefined;

    if (updateFireblocksCwWalletDto.SleevesTransactions) {
      const SleevesTransactionsObjects =
        await this.sleevesTransactionService.findByIds(
          updateFireblocksCwWalletDto.SleevesTransactions.map(
            (entity) => entity.id,
          ),
        );
      if (
        SleevesTransactionsObjects.length !==
        updateFireblocksCwWalletDto.SleevesTransactions.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            SleevesTransactions: 'notExists',
          },
        });
      }
      SleevesTransactions = SleevesTransactionsObjects;
    } else if (updateFireblocksCwWalletDto.SleevesTransactions === null) {
      SleevesTransactions = null;
    }

    let account: Account | undefined = undefined;

    if (updateFireblocksCwWalletDto.account) {
      account = await this.accountService.findByIdOrFail(
        updateFireblocksCwWalletDto.account.id,
      );
    }

    return this.fireblocksCwWalletRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      SleevesTransactions,

      account,

      assetId: updateFireblocksCwWalletDto.assetId,

      address: updateFireblocksCwWalletDto.address,
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
}
