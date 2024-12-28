import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NftTransactionEntity } from '../entities/nft-transaction.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { NftTransaction } from '../../../../domain/nft-transaction';
import { NftTransactionRepository } from '../../nft-transaction.repository';
import { NftTransactionMapper } from '../mappers/nft-transaction.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class NftTransactionRelationalRepository
	implements NftTransactionRepository
{
	constructor(
		@InjectRepository(NftTransactionEntity)
		private readonly nftTransactionRepository: Repository<NftTransactionEntity>,
	) {}

	async create(data: NftTransaction): Promise<NftTransaction> {
		const persistenceModel = NftTransactionMapper.toPersistence(data);
		const newEntity = await this.nftTransactionRepository.save(
			this.nftTransactionRepository.create(persistenceModel),
		);
		return NftTransactionMapper.toDomain(newEntity);
	}

	async findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}): Promise<NftTransaction[]> {
		const entities = await this.nftTransactionRepository.find({
			skip: (paginationOptions.page - 1) * paginationOptions.limit,
			take: paginationOptions.limit,
		});

		return entities.map((entity) => NftTransactionMapper.toDomain(entity));
	}

	async findById(
		id: NftTransaction['id'],
	): Promise<NullableType<NftTransaction>> {
		const entity = await this.nftTransactionRepository.findOne({
			where: { id },
		});

		return entity ? NftTransactionMapper.toDomain(entity) : null;
	}

	async findByIds(ids: NftTransaction['id'][]): Promise<NftTransaction[]> {
		const entities = await this.nftTransactionRepository.find({
			where: { id: In(ids) },
		});

		return entities.map((entity) => NftTransactionMapper.toDomain(entity));
	}

	async update(
		id: NftTransaction['id'],
		payload: Partial<NftTransaction>,
	): Promise<NftTransaction> {
		const entity = await this.nftTransactionRepository.findOne({
			where: { id },
		});

		if (!entity) {
			throw new Error('Record not found');
		}

		const updatedEntity = await this.nftTransactionRepository.save(
			this.nftTransactionRepository.create(
				NftTransactionMapper.toPersistence({
					...NftTransactionMapper.toDomain(entity),
					...payload,
				}),
			),
		);

		return NftTransactionMapper.toDomain(updatedEntity);
	}

	async remove(id: NftTransaction['id']): Promise<void> {
		await this.nftTransactionRepository.delete(id);
	}
}
