import { Injectable } from '@nestjs/common';
import { CreateSwapTransactionDto } from './dto/create-swap-transaction.dto';
import { UpdateSwapTransactionDto } from './dto/update-swap-transaction.dto';
import { SwapTransactionRepository } from './infrastructure/persistence/swap-transaction.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { SwapTransaction } from './domain/swap-transaction';

@Injectable()
export class SwapTransactionsService {
  constructor(
    // Dependencies here
    private readonly swapTransactionRepository: SwapTransactionRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createSwapTransactionDto: CreateSwapTransactionDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.swapTransactionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateSwapTransactionDto: UpdateSwapTransactionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.swapTransactionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: SwapTransaction['id']) {
    return this.swapTransactionRepository.remove(id);
  }
}
