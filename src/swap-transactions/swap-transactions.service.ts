import { TransactionsService } from '../transactions/transactions.service';
import { Transaction } from '../transactions/domain/transaction';

import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateSwapTransactionDto } from './dto/create-swap-transaction.dto';
import { UpdateSwapTransactionDto } from './dto/update-swap-transaction.dto';
import { SwapTransactionRepository } from './infrastructure/persistence/swap-transaction.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { SwapTransaction } from './domain/swap-transaction';

@Injectable()
export class SwapTransactionsService {
  constructor(
    private readonly transactionService: TransactionsService,

    // Dependencies here
    private readonly swapTransactionRepository: SwapTransactionRepository,
  ) {}

  async create(createSwapTransactionDto: CreateSwapTransactionDto) {
    // Do not remove comment below.
    // <creating-property />
    let transaction: Transaction | undefined = undefined;

    if (createSwapTransactionDto.transaction) {
      const transactionObject = await this.transactionService.findById(
        createSwapTransactionDto.transaction.id,
      );
      if (!transactionObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            transaction: 'notExists',
          },
        });
      }
      transaction = transactionObject;
    }

    return this.swapTransactionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      transaction,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.swapTransactionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: SwapTransaction['id']) {
    return this.swapTransactionRepository.findById(id);
  }

  findByIds(ids: SwapTransaction['id'][]) {
    return this.swapTransactionRepository.findByIds(ids);
  }

  async update(
    id: SwapTransaction['id'],

    updateSwapTransactionDto: UpdateSwapTransactionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let transaction: Transaction | undefined = undefined;

    if (updateSwapTransactionDto.transaction) {
      const transactionObject = await this.transactionService.findById(
        updateSwapTransactionDto.transaction.id,
      );
      if (!transactionObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            transaction: 'notExists',
          },
        });
      }
      transaction = transactionObject;
    }

    return this.swapTransactionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      transaction,
    });
  }

  remove(id: SwapTransaction['id']) {
    return this.swapTransactionRepository.remove(id);
  }
}
