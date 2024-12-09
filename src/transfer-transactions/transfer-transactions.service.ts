import { TransactionsService } from '../transactions/transactions.service';
import { Transaction } from '../transactions/domain/transaction';

import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateTransferTransactionDto } from './dto/create-transfer-transaction.dto';
import { UpdateTransferTransactionDto } from './dto/update-transfer-transaction.dto';
import { TransferTransactionRepository } from './infrastructure/persistence/transfer-transaction.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { TransferTransaction } from './domain/transfer-transaction';

@Injectable()
export class TransferTransactionsService {
  constructor(
    private readonly transactionService: TransactionsService,

    // Dependencies here
    private readonly transferTransactionRepository: TransferTransactionRepository,
  ) {}

  async create(createTransferTransactionDto: CreateTransferTransactionDto) {
    // Do not remove comment below.
    // <creating-property />
    let transaction: Transaction | undefined = undefined;

    if (createTransferTransactionDto.transaction) {
      const transactionObject = await this.transactionService.findById(
        createTransferTransactionDto.transaction.id,
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

    return this.transferTransactionRepository.create({
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
    return this.transferTransactionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: TransferTransaction['id']) {
    return this.transferTransactionRepository.findById(id);
  }

  findByIds(ids: TransferTransaction['id'][]) {
    return this.transferTransactionRepository.findByIds(ids);
  }

  async update(
    id: TransferTransaction['id'],

    updateTransferTransactionDto: UpdateTransferTransactionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let transaction: Transaction | undefined = undefined;

    if (updateTransferTransactionDto.transaction) {
      const transactionObject = await this.transactionService.findById(
        updateTransferTransactionDto.transaction.id,
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

    return this.transferTransactionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      transaction,
    });
  }

  remove(id: TransferTransaction['id']) {
    return this.transferTransactionRepository.remove(id);
  }
}
