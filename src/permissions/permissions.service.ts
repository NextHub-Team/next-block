import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionRepository } from './infrastructure/persistence/permission.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Permission } from './domain/permission';

@Injectable()
export class PermissionsService {
	constructor(
		// Dependencies here
		private readonly permissionRepository: PermissionRepository,
	) {}

	async create(createPermissionDto: CreatePermissionDto) {
		// Do not remove comment below.
		// <creating-property />

		return this.permissionRepository.create({
			// Do not remove comment below.
			// <creating-property-payload />
			names: createPermissionDto.names,

			description: createPermissionDto.description,
		});
	}

	findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}) {
		return this.permissionRepository.findAllWithPagination({
			paginationOptions: {
				page: paginationOptions.page,
				limit: paginationOptions.limit,
			},
		});
	}

	findById(id: Permission['id']) {
		return this.permissionRepository.findById(id);
	}

	findByIds(ids: Permission['id'][]) {
		return this.permissionRepository.findByIds(ids);
	}

	async update(id: Permission['id'], updatePermissionDto: UpdatePermissionDto) {
		// Do not remove comment below.
		// <updating-property />

		return this.permissionRepository.update(id, {
			// Do not remove comment below.
			// <updating-property-payload />
			names: updatePermissionDto.names,

			description: updatePermissionDto.description,
		});
	}

	remove(id: Permission['id']) {
		return this.permissionRepository.remove(id);
	}
}
