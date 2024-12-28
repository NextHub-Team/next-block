import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserLogEntity } from '../entities/user-log.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { UserLog } from '../../../../domain/user-log';
import { UserLogRepository } from '../../user-log.repository';
import { UserLogMapper } from '../mappers/user-log.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class UserLogRelationalRepository implements UserLogRepository {
	constructor(
		@InjectRepository(UserLogEntity)
		private readonly userLogRepository: Repository<UserLogEntity>,
	) {}

	async create(data: UserLog): Promise<UserLog> {
		const persistenceModel = UserLogMapper.toPersistence(data);
		const newEntity = await this.userLogRepository.save(
			this.userLogRepository.create(persistenceModel),
		);
		return UserLogMapper.toDomain(newEntity);
	}

	async findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}): Promise<UserLog[]> {
		const entities = await this.userLogRepository.find({
			skip: (paginationOptions.page - 1) * paginationOptions.limit,
			take: paginationOptions.limit,
		});

		return entities.map((entity) => UserLogMapper.toDomain(entity));
	}

	async findById(id: UserLog['id']): Promise<NullableType<UserLog>> {
		const entity = await this.userLogRepository.findOne({
			where: { id },
		});

		return entity ? UserLogMapper.toDomain(entity) : null;
	}

	async findByIds(ids: UserLog['id'][]): Promise<UserLog[]> {
		const entities = await this.userLogRepository.find({
			where: { id: In(ids) },
		});

		return entities.map((entity) => UserLogMapper.toDomain(entity));
	}

	async update(id: UserLog['id'], payload: Partial<UserLog>): Promise<UserLog> {
		const entity = await this.userLogRepository.findOne({
			where: { id },
		});

		if (!entity) {
			throw new Error('Record not found');
		}

		const updatedEntity = await this.userLogRepository.save(
			this.userLogRepository.create(
				UserLogMapper.toPersistence({
					...UserLogMapper.toDomain(entity),
					...payload,
				}),
			),
		);

		return UserLogMapper.toDomain(updatedEntity);
	}

	async remove(id: UserLog['id']): Promise<void> {
		await this.userLogRepository.delete(id);
	}
}
