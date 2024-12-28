import { NftsService } from '../nfts/nfts.service';
import {
	forwardRef,
	HttpStatus,
	Inject,
	UnprocessableEntityException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateNftTransactionDto } from './dto/create-nft-transaction.dto';
import { UpdateNftTransactionDto } from './dto/update-nft-transaction.dto';
import { NftTransactionRepository } from './infrastructure/persistence/nft-transaction.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { NftTransaction } from './domain/nft-transaction';
import { Nft } from '../nfts/domain/nft';

@Injectable()
export class NftTransactionsService {
	constructor(
		@Inject(forwardRef(() => NftsService))
		private readonly nftService: NftsService,
		// Dependencies here
		private readonly nftTransactionRepository: NftTransactionRepository,
	) {}

	async create(createNftTransactionDto: CreateNftTransactionDto) {
		// Do not remove comment below.
		// <creating-property />

		let nft: Nft | undefined = undefined;

		if (createNftTransactionDto.nft) {
			const nftObject = await this.nftService.findById(
				createNftTransactionDto.nft.id,
			);
			if (!nftObject) {
				throw new UnprocessableEntityException({
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						nft: 'notExists',
					},
				});
			}
			nft = nftObject;
		}
		return this.nftTransactionRepository.create({
			// Do not remove comment below.
			// <creating-property-payload />
			fee: createNftTransactionDto.fee,

			transactionHash: createNftTransactionDto.transactionHash,

			toAddress: createNftTransactionDto.toAddress,

			fromAddress: createNftTransactionDto.fromAddress,

			contractAddress: createNftTransactionDto.contractAddress,

			blockchain: createNftTransactionDto.blockchain,

			wallet: createNftTransactionDto.wallet,

			nft,
		});
	}

	findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}) {
		return this.nftTransactionRepository.findAllWithPagination({
			paginationOptions: {
				page: paginationOptions.page,
				limit: paginationOptions.limit,
			},
		});
	}

	findById(id: NftTransaction['id']) {
		return this.nftTransactionRepository.findById(id);
	}

	findByIds(ids: NftTransaction['id'][]) {
		return this.nftTransactionRepository.findByIds(ids);
	}

	async update(
		id: NftTransaction['id'],

		updateNftTransactionDto: UpdateNftTransactionDto,
	) {
		// Do not remove comment below.
		// <updating-property />

		let nft: Nft | undefined = undefined;

		if (updateNftTransactionDto.nft) {
			const nftObject = await this.nftService.findById(
				updateNftTransactionDto.nft.id,
			);
			if (!nftObject) {
				throw new UnprocessableEntityException({
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						nft: 'notExists',
					},
				});
			}
			nft = nftObject;
		}

		return this.nftTransactionRepository.update(id, {
			// Do not remove comment below.
			// <updating-property-payload />
			fee: updateNftTransactionDto.fee,

			transactionHash: updateNftTransactionDto.transactionHash,

			toAddress: updateNftTransactionDto.toAddress,

			fromAddress: updateNftTransactionDto.fromAddress,

			contractAddress: updateNftTransactionDto.contractAddress,

			blockchain: updateNftTransactionDto.blockchain,

			wallet: updateNftTransactionDto.wallet,

			nft,
		});
	}

	remove(id: NftTransaction['id']) {
		return this.nftTransactionRepository.remove(id);
	}
}
