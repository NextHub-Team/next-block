import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MainWalletEntity } from '../entities/main-wallet.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { MainWallet } from '../../../../domain/main-wallet';
import { MainWalletRepository } from '../../main-wallet.repository';
import { MainWalletMapper } from '../mappers/main-wallet.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class MainWalletRelationalRepository implements MainWalletRepository {
	constructor(
		@InjectRepository(MainWalletEntity)
		private readonly mainWalletRepository: Repository<MainWalletEntity>,
	) {}

	async create(data: MainWallet): Promise<MainWallet> {
		const persistenceModel = MainWalletMapper.toPersistence(data);
		const newEntity = await this.mainWalletRepository.save(
			this.mainWalletRepository.create(persistenceModel),
		);
		return MainWalletMapper.toDomain(newEntity);
	}

	async findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}): Promise<MainWallet[]> {
		const entities = await this.mainWalletRepository.find({
			skip: (paginationOptions.page - 1) * paginationOptions.limit,
			take: paginationOptions.limit,
		});

		return entities.map((entity) => MainWalletMapper.toDomain(entity));
	}

	async findById(id: MainWallet['id']): Promise<NullableType<MainWallet>> {
		const entity = await this.mainWalletRepository.findOne({
			where: { id },
		});

		return entity ? MainWalletMapper.toDomain(entity) : null;
	}

	async findByIds(ids: MainWallet['id'][]): Promise<MainWallet[]> {
		const entities = await this.mainWalletRepository.find({
			where: { id: In(ids) },
		});

		return entities.map((entity) => MainWalletMapper.toDomain(entity));
	}

	async update(
		id: MainWallet['id'],
		payload: Partial<MainWallet>,
	): Promise<MainWallet> {
		const entity = await this.mainWalletRepository.findOne({
			where: { id },
		});

		if (!entity) {
			throw new Error('Record not found');
		}

		const updatedEntity = await this.mainWalletRepository.save(
			this.mainWalletRepository.create(
				MainWalletMapper.toPersistence({
					...MainWalletMapper.toDomain(entity),
					...payload,
				}),
			),
		);

		return MainWalletMapper.toDomain(updatedEntity);
	}

	async remove(id: MainWallet['id']): Promise<void> {
		await this.mainWalletRepository.delete(id);
	}
}
