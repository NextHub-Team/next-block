import { WalletsService } from '../wallets/wallets.service';
import { Wallet } from '../wallets/domain/wallet';

import {
  forwardRef,
  HttpStatus,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateTransactionLogDto } from './dto/create-transaction-log.dto';
import { UpdateTransactionLogDto } from './dto/update-transaction-log.dto';
import { TransactionLogRepository } from './infrastructure/persistence/transaction-log.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { TransactionLog } from './domain/transaction-log';

@Injectable()
export class TransactionLogsService {
  constructor(
    @Inject(forwardRef(() => WalletsService))
    private readonly walletService: WalletsService,
    // Dependencies here
    private readonly transactionLogRepository: TransactionLogRepository,
  ) {}

  async create(createTransactionLogDto: CreateTransactionLogDto) {
    // Do not remove comment below.
    // <creating-property />

    let wallet: Wallet | undefined = undefined;

    if (createTransactionLogDto.wallet) {
      const walletObject = await this.walletService.findById(
        createTransactionLogDto.wallet.id,
      );
      if (!walletObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            wallet: 'notExists',
          },
        });
      }
      wallet = walletObject;
    }

    return this.transactionLogRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      details: createTransactionLogDto.details,

      priority: createTransactionLogDto.priority,

      status: createTransactionLogDto.status,

      type: createTransactionLogDto.type,

      assetName: createTransactionLogDto.assetName,

      wallet,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.transactionLogRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: TransactionLog['id']) {
    return this.transactionLogRepository.findById(id);
  }

  findByIds(ids: TransactionLog['id'][]) {
    return this.transactionLogRepository.findByIds(ids);
  }

  async update(
    id: TransactionLog['id'],

    updateTransactionLogDto: UpdateTransactionLogDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let wallet: Wallet | undefined = undefined;

    if (updateTransactionLogDto.wallet) {
      const walletObject = await this.walletService.findById(
        updateTransactionLogDto.wallet.id,
      );
      if (!walletObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            wallet: 'notExists',
          },
        });
      }
      wallet = walletObject;
    }
    return this.transactionLogRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      details: updateTransactionLogDto.details,

      priority: updateTransactionLogDto.priority,
      status: updateTransactionLogDto.status,
      type: updateTransactionLogDto.type,
      assetName: updateTransactionLogDto.assetName,

      wallet,
    });
  }

  remove(id: TransactionLog['id']) {
    return this.transactionLogRepository.remove(id);
  }
}
