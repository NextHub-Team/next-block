import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { WhiteListAddressEntity } from '../entities/white-list-address.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { WhiteListAddress } from '../../../../domain/white-list-address';
import { WhiteListAddressRepository } from '../../white-list-address.repository';
import { WhiteListAddressMapper } from '../mappers/white-list-address.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class WhiteListAddressRelationalRepository
	implements WhiteListAddressRepository
{
	constructor(
		@InjectRepository(WhiteListAddressEntity)
		private readonly whiteListAddressRepository: Repository<WhiteListAddressEntity>,
	) {}

	async create(data: WhiteListAddress): Promise<WhiteListAddress> {
		const persistenceModel = WhiteListAddressMapper.toPersistence(data);
		const newEntity = await this.whiteListAddressRepository.save(
			this.whiteListAddressRepository.create(persistenceModel),
		);
		return WhiteListAddressMapper.toDomain(newEntity);
	}

	async findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}): Promise<WhiteListAddress[]> {
		const entities = await this.whiteListAddressRepository.find({
			skip: (paginationOptions.page - 1) * paginationOptions.limit,
			take: paginationOptions.limit,
		});

		return entities.map((entity) => WhiteListAddressMapper.toDomain(entity));
	}

	async findById(
		id: WhiteListAddress['id'],
	): Promise<NullableType<WhiteListAddress>> {
		const entity = await this.whiteListAddressRepository.findOne({
			where: { id },
		});

		return entity ? WhiteListAddressMapper.toDomain(entity) : null;
	}

	async findByIds(ids: WhiteListAddress['id'][]): Promise<WhiteListAddress[]> {
		const entities = await this.whiteListAddressRepository.find({
			where: { id: In(ids) },
		});

		return entities.map((entity) => WhiteListAddressMapper.toDomain(entity));
	}

	async update(
		id: WhiteListAddress['id'],
		payload: Partial<WhiteListAddress>,
	): Promise<WhiteListAddress> {
		const entity = await this.whiteListAddressRepository.findOne({
			where: { id },
		});

		if (!entity) {
			throw new Error('Record not found');
		}

		const updatedEntity = await this.whiteListAddressRepository.save(
			this.whiteListAddressRepository.create(
				WhiteListAddressMapper.toPersistence({
					...WhiteListAddressMapper.toDomain(entity),
					...payload,
				}),
			),
		);

		return WhiteListAddressMapper.toDomain(updatedEntity);
	}

	async remove(id: WhiteListAddress['id']): Promise<void> {
		await this.whiteListAddressRepository.delete(id);
	}
}
