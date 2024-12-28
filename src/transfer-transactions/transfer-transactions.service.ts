import { Injectable } from '@nestjs/common';
import { CreateTransferTransactionDto } from './dto/create-transfer-transaction.dto';
import { UpdateTransferTransactionDto } from './dto/update-transfer-transaction.dto';
import { TransferTransactionRepository } from './infrastructure/persistence/transfer-transaction.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { TransferTransaction } from './domain/transfer-transaction';

@Injectable()
export class TransferTransactionsService {
	constructor(
		// Dependencies here
		private readonly transferTransactionRepository: TransferTransactionRepository,
	) {}

	async create(createTransferTransactionDto: CreateTransferTransactionDto) {
		// Do not remove comment below.
		// <creating-property />

		return this.transferTransactionRepository.create({
			// Do not remove comment below.
			// <creating-property-payload />
			fromAddress: createTransferTransactionDto.fromAddress,

			toAddress: createTransferTransactionDto.toAddress,

			fee: createTransferTransactionDto.fee,

			amount: createTransferTransactionDto.amount,

			blockchain: createTransferTransactionDto.blockchain,

			transactionHash: createTransferTransactionDto.transactionHash,

			wallet: createTransferTransactionDto.wallet,
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

		return this.transferTransactionRepository.update(id, {
			// Do not remove comment below.
			// <updating-property-payload />
			fromAddress: updateTransferTransactionDto.fromAddress,

			toAddress: updateTransferTransactionDto.toAddress,

			fee: updateTransferTransactionDto.fee,

			amount: updateTransferTransactionDto.amount,

			blockchain: updateTransferTransactionDto.blockchain,

			transactionHash: updateTransferTransactionDto.transactionHash,

			wallet: updateTransferTransactionDto.wallet,
		});
	}

	remove(id: TransferTransaction['id']) {
		return this.transferTransactionRepository.remove(id);
	}
}
