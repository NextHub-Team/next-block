import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AccessControlEntity } from '../entities/access-control.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { AccessControl } from '../../../../domain/access-control';
import { AccessControlRepository } from '../../access-control.repository';
import { AccessControlMapper } from '../mappers/access-control.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class AccessControlRelationalRepository
	implements AccessControlRepository
{
	constructor(
		@InjectRepository(AccessControlEntity)
		private readonly accessControlRepository: Repository<AccessControlEntity>,
	) {}

	async create(data: AccessControl): Promise<AccessControl> {
		const persistenceModel = AccessControlMapper.toPersistence(data);
		const newEntity = await this.accessControlRepository.save(
			this.accessControlRepository.create(persistenceModel),
		);
		return AccessControlMapper.toDomain(newEntity);
	}

	async findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}): Promise<AccessControl[]> {
		const entities = await this.accessControlRepository.find({
			skip: (paginationOptions.page - 1) * paginationOptions.limit,
			take: paginationOptions.limit,
		});

		return entities.map((entity) => AccessControlMapper.toDomain(entity));
	}

	async findById(
		id: AccessControl['id'],
	): Promise<NullableType<AccessControl>> {
		const entity = await this.accessControlRepository.findOne({
			where: { id },
		});

		return entity ? AccessControlMapper.toDomain(entity) : null;
	}

	async findByIds(ids: AccessControl['id'][]): Promise<AccessControl[]> {
		const entities = await this.accessControlRepository.find({
			where: { id: In(ids) },
		});

		return entities.map((entity) => AccessControlMapper.toDomain(entity));
	}

	async update(
		id: AccessControl['id'],
		payload: Partial<AccessControl>,
	): Promise<AccessControl> {
		const entity = await this.accessControlRepository.findOne({
			where: { id },
		});

		if (!entity) {
			throw new Error('Record not found');
		}

		const updatedEntity = await this.accessControlRepository.save(
			this.accessControlRepository.create(
				AccessControlMapper.toPersistence({
					...AccessControlMapper.toDomain(entity),
					...payload,
				}),
			),
		);

		return AccessControlMapper.toDomain(updatedEntity);
	}

	async remove(id: AccessControl['id']): Promise<void> {
		await this.accessControlRepository.delete(id);
	}
}
