import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TransferTransactionEntity } from '../entities/transfer-transaction.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { TransferTransaction } from '../../../../domain/transfer-transaction';
import { TransferTransactionRepository } from '../../transfer-transaction.repository';
import { TransferTransactionMapper } from '../mappers/transfer-transaction.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TransferTransactionRelationalRepository
	implements TransferTransactionRepository
{
	constructor(
		@InjectRepository(TransferTransactionEntity)
		private readonly transferTransactionRepository: Repository<TransferTransactionEntity>,
	) {}

	async create(data: TransferTransaction): Promise<TransferTransaction> {
		const persistenceModel = TransferTransactionMapper.toPersistence(data);
		const newEntity = await this.transferTransactionRepository.save(
			this.transferTransactionRepository.create(persistenceModel),
		);
		return TransferTransactionMapper.toDomain(newEntity);
	}

	async findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}): Promise<TransferTransaction[]> {
		const entities = await this.transferTransactionRepository.find({
			skip: (paginationOptions.page - 1) * paginationOptions.limit,
			take: paginationOptions.limit,
		});

		return entities.map((entity) => TransferTransactionMapper.toDomain(entity));
	}

	async findById(
		id: TransferTransaction['id'],
	): Promise<NullableType<TransferTransaction>> {
		const entity = await this.transferTransactionRepository.findOne({
			where: { id },
		});

		return entity ? TransferTransactionMapper.toDomain(entity) : null;
	}

	async findByIds(
		ids: TransferTransaction['id'][],
	): Promise<TransferTransaction[]> {
		const entities = await this.transferTransactionRepository.find({
			where: { id: In(ids) },
		});

		return entities.map((entity) => TransferTransactionMapper.toDomain(entity));
	}

	async update(
		id: TransferTransaction['id'],
		payload: Partial<TransferTransaction>,
	): Promise<TransferTransaction> {
		const entity = await this.transferTransactionRepository.findOne({
			where: { id },
		});

		if (!entity) {
			throw new Error('Record not found');
		}

		const updatedEntity = await this.transferTransactionRepository.save(
			this.transferTransactionRepository.create(
				TransferTransactionMapper.toPersistence({
					...TransferTransactionMapper.toDomain(entity),
					...payload,
				}),
			),
		);

		return TransferTransactionMapper.toDomain(updatedEntity);
	}

	async remove(id: TransferTransaction['id']): Promise<void> {
		await this.transferTransactionRepository.delete(id);
	}
}
