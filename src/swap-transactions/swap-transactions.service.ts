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

  async create(createSwapTransactionDto: CreateSwapTransactionDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.swapTransactionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      transaction_fee: createSwapTransactionDto.transaction_fee,

      dex: createSwapTransactionDto.dex,

      amount_out: createSwapTransactionDto.amount_out,

      amount_in: createSwapTransactionDto.amount_in,

      to_token: createSwapTransactionDto.to_token,

      wallet: createSwapTransactionDto.wallet,

      from_token: createSwapTransactionDto.from_token,
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

    return this.swapTransactionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      transaction_fee: updateSwapTransactionDto.transaction_fee,

      dex: updateSwapTransactionDto.dex,

      amount_out: updateSwapTransactionDto.amount_out,

      amount_in: updateSwapTransactionDto.amount_in,

      to_token: updateSwapTransactionDto.to_token,

      wallet: updateSwapTransactionDto.wallet,

      from_token: updateSwapTransactionDto.from_token,
    });
  }

  remove(id: SwapTransaction['id']) {
    return this.swapTransactionRepository.remove(id);
  }
}
