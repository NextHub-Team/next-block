import { Injectable } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { TypeRepository } from './infrastructure/persistence/type.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Type } from './domain/type';

@Injectable()
export class TypesService {
	constructor(
		// Dependencies here
		private readonly typeRepository: TypeRepository,
	) {}

	async create(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		createTypeDto: CreateTypeDto,
	) {
		// Do not remove comment below.
		// <creating-property />

		return this.typeRepository.create({
			// Do not remove comment below.
			// <creating-property-payload />
		});
	}

	findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}) {
		return this.typeRepository.findAllWithPagination({
			paginationOptions: {
				page: paginationOptions.page,
				limit: paginationOptions.limit,
			},
		});
	}

	findById(id: Type['id']) {
		return this.typeRepository.findById(id);
	}

	findByIds(ids: Type['id'][]) {
		return this.typeRepository.findByIds(ids);
	}

	async update(
		id: Type['id'],
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		updateTypeDto: UpdateTypeDto,
	) {
		// Do not remove comment below.
		// <updating-property />

		return this.typeRepository.update(id, {
			// Do not remove comment below.
			// <updating-property-payload />
		});
	}

	remove(id: Type['id']) {
		return this.typeRepository.remove(id);
	}
}
