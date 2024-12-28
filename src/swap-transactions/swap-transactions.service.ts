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
			fee: createSwapTransactionDto.fee,

			dex: createSwapTransactionDto.dex,

			amountOut: createSwapTransactionDto.amountOut,

			amountIn: createSwapTransactionDto.amountIn,

			toToken: createSwapTransactionDto.toToken,

			wallet: createSwapTransactionDto.wallet,

			fromToken: createSwapTransactionDto.fromToken,
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
			fee: updateSwapTransactionDto.fee,

			dex: updateSwapTransactionDto.dex,

			amountOut: updateSwapTransactionDto.amountOut,

			amountIn: updateSwapTransactionDto.amountIn,

			toToken: updateSwapTransactionDto.toToken,

			wallet: updateSwapTransactionDto.wallet,

			fromToken: updateSwapTransactionDto.fromToken,
		});
	}

	remove(id: SwapTransaction['id']) {
		return this.swapTransactionRepository.remove(id);
	}
}
