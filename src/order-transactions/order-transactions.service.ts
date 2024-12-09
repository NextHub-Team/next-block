import { Injectable } from '@nestjs/common';
import { CreateOrderTransactionDto } from './dto/create-order-transaction.dto';
import { UpdateOrderTransactionDto } from './dto/update-order-transaction.dto';
import { OrderTransactionRepository } from './infrastructure/persistence/order-transaction.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { OrderTransaction } from './domain/order-transaction';

@Injectable()
export class OrderTransactionsService {
  constructor(
    // Dependencies here
    private readonly orderTransactionRepository: OrderTransactionRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createOrderTransactionDto: CreateOrderTransactionDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.orderTransactionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateOrderTransactionDto: UpdateOrderTransactionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.orderTransactionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: OrderTransaction['id']) {
    return this.orderTransactionRepository.remove(id);
  }
}
