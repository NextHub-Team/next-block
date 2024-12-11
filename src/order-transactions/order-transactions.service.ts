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

  async create(createOrderTransactionDto: CreateOrderTransactionDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.orderTransactionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      type: createOrderTransactionDto.type,

      fee: createOrderTransactionDto.fee,

      paymentMethod: createOrderTransactionDto.paymentMethod,

      totalValue: createOrderTransactionDto.totalValue,

      price: createOrderTransactionDto.price,

      cryptoAmount: createOrderTransactionDto.cryptoAmount,

      currencyAmount: createOrderTransactionDto.currencyAmount,

      wallet: createOrderTransactionDto.wallet,
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

    return this.orderTransactionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      type: updateOrderTransactionDto.type,

      fee: updateOrderTransactionDto.fee,

      paymentMethod: updateOrderTransactionDto.paymentMethod,

      totalValue: updateOrderTransactionDto.totalValue,

      price: updateOrderTransactionDto.price,

      cryptoAmount: updateOrderTransactionDto.cryptoAmount,

      currencyAmount: updateOrderTransactionDto.currencyAmount,

      wallet: updateOrderTransactionDto.wallet,
    });
  }

  remove(id: OrderTransaction['id']) {
    return this.orderTransactionRepository.remove(id);
  }
}
