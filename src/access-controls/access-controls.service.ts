import { PermissionsService } from '../permissions/permissions.service';
import { Permission } from '../permissions/domain/permission';

import { StatusesService } from '../statuses/statuses.service';
import { Status } from '../statuses/domain/status';

import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/domain/role';

import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
	forwardRef,
	HttpStatus,
	Inject,
	UnprocessableEntityException,
} from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { CreateAccessControlDto } from './dto/create-access-control.dto';
import { UpdateAccessControlDto } from './dto/update-access-control.dto';
import { AccessControlRepository } from './infrastructure/persistence/access-control.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { AccessControl } from './domain/access-control';

@Injectable()
export class AccessControlsService {
	constructor(
		private readonly permissionService: PermissionsService,
		private readonly statusService: StatusesService,
		private readonly roleService: RolesService,
		@Inject(forwardRef(() => UsersService))
		private readonly userService: UsersService,
		// Dependencies here
		private readonly accessControlRepository: AccessControlRepository,
	) {}

	async create(createAccessControlDto: CreateAccessControlDto) {
		// Do not remove comment below.
		// <creating-property />

		let permission: Permission | null | undefined = undefined;

		if (createAccessControlDto.permission) {
			const permissionObject = await this.permissionService.findById(
				createAccessControlDto.permission.id,
			);
			if (!permissionObject) {
				throw new UnprocessableEntityException({
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						permission: 'notExists',
					},
				});
			}
			permission = permissionObject;
		} else if (createAccessControlDto.permission === null) {
			permission = null;
		}

		let status: Status | null | undefined = undefined;

		if (createAccessControlDto.status) {
			const statusObject = await this.statusService.findById(
				createAccessControlDto.status.id,
			);
			if (!statusObject) {
				throw new UnprocessableEntityException({
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						status: 'notExists',
					},
				});
			}
			status = statusObject;
		} else if (createAccessControlDto.status === null) {
			status = null;
		}

		const roleObject = await this.roleService.findById(
			createAccessControlDto.role.id,
		);
		if (!roleObject) {
			throw new UnprocessableEntityException({
				status: HttpStatus.UNPROCESSABLE_ENTITY,
				errors: {
					role: 'notExists',
				},
			});
		}
		const role = roleObject;

		const userObject = await this.userService.findById(
			createAccessControlDto.user.id,
		);
		if (!userObject) {
			throw new UnprocessableEntityException({
				status: HttpStatus.UNPROCESSABLE_ENTITY,
				errors: {
					user: 'notExists',
				},
			});
		}
		const user = userObject;

		return this.accessControlRepository.create({
			// Do not remove comment below.
			// <creating-property-payload />
			description: createAccessControlDto.description,

			permission,

			status,

			role,

			user,
		});
	}

	findAllWithPagination({
		paginationOptions,
	}: {
		paginationOptions: IPaginationOptions;
	}) {
		return this.accessControlRepository.findAllWithPagination({
			paginationOptions: {
				page: paginationOptions.page,
				limit: paginationOptions.limit,
			},
		});
	}

	findById(id: AccessControl['id']) {
		return this.accessControlRepository.findById(id);
	}

	findByIds(ids: AccessControl['id'][]) {
		return this.accessControlRepository.findByIds(ids);
	}

	async update(
		id: AccessControl['id'],

		updateAccessControlDto: UpdateAccessControlDto,
	) {
		// Do not remove comment below.
		// <updating-property />

		let permission: Permission | null | undefined = undefined;

		if (updateAccessControlDto.permission) {
			const permissionObject = await this.permissionService.findById(
				updateAccessControlDto.permission.id,
			);
			if (!permissionObject) {
				throw new UnprocessableEntityException({
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						permission: 'notExists',
					},
				});
			}
			permission = permissionObject;
		} else if (updateAccessControlDto.permission === null) {
			permission = null;
		}

		let status: Status | null | undefined = undefined;

		if (updateAccessControlDto.status) {
			const statusObject = await this.statusService.findById(
				updateAccessControlDto.status.id,
			);
			if (!statusObject) {
				throw new UnprocessableEntityException({
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						status: 'notExists',
					},
				});
			}
			status = statusObject;
		} else if (updateAccessControlDto.status === null) {
			status = null;
		}

		let role: Role | undefined = undefined;

		if (updateAccessControlDto.role) {
			const roleObject = await this.roleService.findById(
				updateAccessControlDto.role.id,
			);
			if (!roleObject) {
				throw new UnprocessableEntityException({
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						role: 'notExists',
					},
				});
			}
			role = roleObject;
		}

		let user: User | undefined = undefined;

		if (updateAccessControlDto.user) {
			const userObject = await this.userService.findById(
				updateAccessControlDto.user.id,
			);
			if (!userObject) {
				throw new UnprocessableEntityException({
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						user: 'notExists',
					},
				});
			}
			user = userObject;
		}

		return this.accessControlRepository.update(id, {
			// Do not remove comment below.
			// <updating-property-payload />
			description: updateAccessControlDto.description,

			permission,

			status,

			role,

			user,
		});
	}

	remove(id: AccessControl['id']) {
		return this.accessControlRepository.remove(id);
	}
}
