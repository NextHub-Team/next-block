import { TransactionsService } from '../transactions/transactions.service';
import { Transaction } from '../transactions/domain/transaction';

import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateOrderTransactionDto } from './dto/create-order-transaction.dto';
import { UpdateOrderTransactionDto } from './dto/update-order-transaction.dto';
import { OrderTransactionRepository } from './infrastructure/persistence/order-transaction.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { OrderTransaction } from './domain/order-transaction';

@Injectable()
export class OrderTransactionsService {
  constructor(
    private readonly transactionService: TransactionsService,

    // Dependencies here
    private readonly orderTransactionRepository: OrderTransactionRepository,
  ) {}

  async create(createOrderTransactionDto: CreateOrderTransactionDto) {
    // Do not remove comment below.
    // <creating-property />
    let transaction: Transaction | undefined = undefined;

    if (createOrderTransactionDto.transaction) {
      const transactionObject = await this.transactionService.findById(
        createOrderTransactionDto.transaction.id,
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

    return this.orderTransactionRepository.create({
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
    return this.orderTransactionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: OrderTransaction['id']) {
    return this.orderTransactionRepository.findById(id);
  }

  findByIds(ids: OrderTransaction['id'][]) {
    return this.orderTransactionRepository.findByIds(ids);
  }

  async update(
    id: OrderTransaction['id'],

    updateOrderTransactionDto: UpdateOrderTransactionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let transaction: Transaction | undefined = undefined;

    if (updateOrderTransactionDto.transaction) {
      const transactionObject = await this.transactionService.findById(
        updateOrderTransactionDto.transaction.id,
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

    return this.orderTransactionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      transaction,
    });
  }

  remove(id: OrderTransaction['id']) {
    return this.orderTransactionRepository.remove(id);
  }
}
