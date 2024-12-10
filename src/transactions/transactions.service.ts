import { WalletsService } from '../wallets/wallets.service';
import { Wallet } from '../wallets/domain/wallet';

import {
  forwardRef,
  HttpStatus,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionRepository } from './infrastructure/persistence/transaction.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Transaction } from './domain/transaction';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(forwardRef(() => WalletsService))
    private readonly walletService: WalletsService,

    // Dependencies here
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    // Do not remove comment below.
    // <creating-property />

    const walletObject = await this.walletService.findById(
      createTransactionDto.wallet.id,
    );
    if (!walletObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          wallet: 'notExists',
        },
      });
    }
    const wallet = walletObject;

    return this.transactionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      details: createTransactionDto.details,

      asset: createTransactionDto.asset,

      priority: createTransactionDto.priority,

      status: createTransactionDto.status,

      type: createTransactionDto.type,

      wallet,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.transactionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Transaction['id']) {
    return this.transactionRepository.findById(id);
  }

  findByIds(ids: Transaction['id'][]) {
    return this.transactionRepository.findByIds(ids);
  }

  async update(
    id: Transaction['id'],
    updateTransactionDto: UpdateTransactionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let wallet: Wallet | undefined = undefined;

    if (updateTransactionDto.wallet) {
      const walletObject = await this.walletService.findById(
        updateTransactionDto.wallet.id,
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

    return this.transactionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      details: updateTransactionDto.details,

      asset: updateTransactionDto.asset,

      priority: updateTransactionDto.priority,

      status: updateTransactionDto.status,

      type: updateTransactionDto.type,

      wallet,
    });
  }

  remove(id: Transaction['id']) {
    return this.transactionRepository.remove(id);
  }
}
